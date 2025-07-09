const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Ensure directories exist
const ensureDirectories = async () => {
  const rootDir = path.join(__dirname, '..');
  const dirs = [
    path.join(rootDir, 'uploads'),
    path.join(rootDir, 'uploads', 'interim'),
    path.join(rootDir, 'uploads', 'projects')
  ];
  
  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
};

// Initialize directories
ensureDirectories();

// Helper function to get project folder path
const getProjectFolder = (projectId) => {
  const rootDir = path.join(__dirname, '..');
  return projectId ? path.join(rootDir, 'uploads', 'projects', projectId) : path.join(rootDir, 'uploads', 'interim');
};

// Helper function to optimize image
const optimizeImage = async (buffer, format = 'webp') => {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    
    // Optimize based on format
    let optimizedImage;
    switch (format) {
      case 'webp':
        optimizedImage = image.webp({ quality: 80 });
        break;
      case 'jpg':
      case 'jpeg':
        optimizedImage = image.jpeg({ quality: 80 });
        break;
      case 'png':
        optimizedImage = image.png({ quality: 80 });
        break;
      default:
        optimizedImage = image.webp({ quality: 80 });
    }
    
    const optimizedBuffer = await optimizedImage.toBuffer();
    return {
      buffer: optimizedBuffer,
      format: format,
      dimensions: {
        width: metadata.width,
        height: metadata.height
      },
      size: optimizedBuffer.length
    };
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw error;
  }
};

// API Routes

// Get all data
app.get('/api/data/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const filePath = path.join(__dirname, '..', 'frontend', 'src', 'data', `${type}.json`);
    
    const data = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error(`Error reading ${req.params.type} data:`, error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Save data
app.post('/api/data/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const filePath = path.join(__dirname, '..', 'frontend', 'src', 'data', `${type}.json`);
    
    await fs.writeFile(filePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error(`Error saving ${req.params.type} data:`, error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Image upload endpoint
app.post('/api/media/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { optimize = 'true', format = 'webp', project = '' } = req.body;
    
    // Generate unique filename
    const fileId = uuidv4();
    const originalExt = path.extname(req.file.originalname);
    const newExt = format === 'webp' ? '.webp' : originalExt;
    const filename = `${fileId}${newExt}`;
    
    // Optimize image if requested
    let finalBuffer = req.file.buffer;
    let dimensions = { width: 0, height: 0 };
    let finalFormat = format;
    let finalSize = req.file.size;
    
    if (optimize === 'true') {
      const optimized = await optimizeImage(req.file.buffer, format);
      finalBuffer = optimized.buffer;
      dimensions = optimized.dimensions;
      finalFormat = optimized.format;
      finalSize = optimized.size;
    }
    
    // Determine save location based on project
    let savePath, publicPath, frontendPath;
    if (project) {
      // Save to project folder
      const projectFolder = path.join(__dirname, '..', 'uploads', 'projects', project);
      await fs.mkdir(projectFolder, { recursive: true });
      savePath = path.join(projectFolder, filename);
      publicPath = `/uploads/projects/${project}/${filename}`;
      
      // Also save to frontend public folder for React dev server
      const frontendProjectFolder = path.join(__dirname, '..', 'frontend', 'public', 'uploads', 'projects', project);
      await fs.mkdir(frontendProjectFolder, { recursive: true });
      frontendPath = path.join(frontendProjectFolder, filename);
    } else {
      // Save to interim folder
      savePath = path.join(__dirname, '..', 'uploads', 'interim', filename);
      publicPath = `/uploads/interim/${filename}`;
      
      // Also save to frontend public folder for React dev server
      const frontendInterimFolder = path.join(__dirname, '..', 'frontend', 'public', 'uploads', 'interim');
      await fs.mkdir(frontendInterimFolder, { recursive: true });
      frontendPath = path.join(frontendInterimFolder, filename);
    }
    
    // Save the file to both locations
    await fs.writeFile(savePath, finalBuffer);
    await fs.writeFile(frontendPath, finalBuffer);
    
    // Return file info
    res.json({
      success: true,
      id: fileId,
      filename: req.file.originalname,
      path: publicPath,
      format: finalFormat,
      size: finalSize,
      dimensions: dimensions,
      project: project
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Move media file between projects
app.post('/api/media/:id/move', async (req, res) => {
  try {
    const { id } = req.params;
    const { oldProject, newProject } = req.body;
    
    // Find the media file
    const mediaPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'media.json');
    const mediaData = JSON.parse(await fs.readFile(mediaPath, 'utf8'));
    const mediaItem = mediaData.media.find(item => item.id === id);
    
    if (!mediaItem) {
      return res.status(404).json({ error: 'Media not found' });
    }
    
    // Extract filename from current path
    const currentPath = mediaItem.path;
    const filename = path.basename(currentPath);
    
    // Define old and new file paths
    const oldFolder = getProjectFolder(oldProject);
    const newFolder = getProjectFolder(newProject);
    const oldFilePath = path.join(oldFolder, filename);
    const newFilePath = path.join(newFolder, filename);
    
    // Ensure new directory exists
    await fs.mkdir(path.dirname(newFilePath), { recursive: true });
    
    // Move the file
    try {
      await fs.rename(oldFilePath, newFilePath);
    } catch (error) {
      // If file doesn't exist in old location, try to copy from interim
      const interimPath = path.join(__dirname, '..', 'uploads', 'interim', filename);
      await fs.copyFile(interimPath, newFilePath);
    }
    
    // Also move/copy the file in the frontend public folder
    const frontendOldPath = path.join(__dirname, '..', 'frontend', 'public', oldFolder.replace(path.join(__dirname, '..'), ''), filename);
    const frontendNewPath = path.join(__dirname, '..', 'frontend', 'public', newFolder.replace(path.join(__dirname, '..'), ''), filename);
    
    try {
      await fs.mkdir(path.dirname(frontendNewPath), { recursive: true });
      await fs.rename(frontendOldPath, frontendNewPath);
    } catch (error) {
      // If file doesn't exist in old location, try to copy from interim
      const frontendInterimPath = path.join(__dirname, '..', 'frontend', 'public', 'uploads', 'interim', filename);
      await fs.copyFile(frontendInterimPath, frontendNewPath);
    }
    
    // Update the media item path
    mediaItem.path = newProject ? `/uploads/projects/${newProject}/${filename}` : `/uploads/interim/${filename}`;
    await fs.writeFile(mediaPath, JSON.stringify(mediaData, null, 2));
    
    res.json({ success: true, newPath: mediaItem.path });
    
  } catch (error) {
    console.error('Error moving media file:', error);
    res.status(500).json({ error: 'Failed to move file' });
  }
});

// Delete media file
app.delete('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the media file
    const mediaPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'media.json');
    const mediaData = JSON.parse(await fs.readFile(mediaPath, 'utf8'));
    const mediaItem = mediaData.media.find(item => item.id === id);
    
    if (!mediaItem) {
      return res.status(404).json({ error: 'Media not found' });
    }
    
    // Extract file path and delete the file from both locations
    const filePath = path.join(__dirname, '..', mediaItem.path.substring(1));
    const frontendFilePath = path.join(__dirname, '..', 'frontend', 'public', mediaItem.path.substring(1));
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn('File not found for deletion (backend):', filePath);
    }
    
    try {
      await fs.unlink(frontendFilePath);
    } catch (error) {
      console.warn('File not found for deletion (frontend):', frontendFilePath);
    }
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting media file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 