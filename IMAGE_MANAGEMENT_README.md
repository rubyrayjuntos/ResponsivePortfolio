# Image Management System

## Overview

The Image Management System is a sophisticated file management solution that simulates a relational database using JSON files. It provides a complete workflow for uploading, optimizing, organizing, and managing image assets with automatic project assignment and folder management.

## Features

### 🚀 **Upload & Optimization**
- **Drag & Drop Interface**: Intuitive drag-and-drop upload with visual feedback
- **Bulk Upload**: Select multiple images at once
- **Automatic Optimization**: Images are automatically converted to WebP format and optimized
- **Metadata Extraction**: Automatically extracts dimensions, file size, and format information
- **Progress Tracking**: Real-time upload progress with percentage display
- **Project Assignment**: Optional project assignment during upload

### 📁 **Folder Management**
- **Interim Storage**: New images are stored in `/uploads/interim/` until assigned to a project
- **Project Assignment**: Images can be assigned to specific projects and moved to `/uploads/projects/{project-id}/`
- **Automatic File Movement**: When project assignment changes, files are automatically moved between folders
- **Unique File Naming**: Uses UUID-based naming to prevent conflicts
- **Dual Storage**: Files saved to both backend and frontend locations for proper serving

### 🏷️ **Organization & Tagging**
- **Category System**: Images can be categorized (thumbnail, gallery, screenshot, mockup, diagram)
- **Tag Support**: Add custom tags for better organization
- **Project Association**: Link images to specific projects
- **Visual Cards**: Beautiful card-based interface showing image previews and metadata
- **Smart Filtering**: Filter by "All", "Unassigned", or specific projects

### 🔧 **Technical Features**
- **Image Optimization**: Automatic WebP conversion with quality optimization
- **Multiple Format Support**: Handles JPG, PNG, GIF, WebP uploads
- **File Size Limits**: 10MB per file with proper error handling
- **Error Recovery**: Graceful handling of upload failures and file operations
- **Dual Server Support**: Works with both React dev server and backend server

## Architecture

### Frontend Components
- **MediaAdmin.js**: Main image management interface with filtering
- **Upload Modal**: Drag & drop upload interface with project selector
- **Edit Modal**: Image metadata editing
- **Image Cards**: Visual representation of images with hover actions

### Backend API Endpoints
- `POST /api/media/upload`: Upload and optimize images
- `POST /api/media/:id/move`: Move images between project folders
- `DELETE /api/media/:id`: Delete images and files
- `GET /api/data/media`: Get media data
- `POST /api/data/media`: Save media data

### File Structure
```
ResponsivePortfolio/
├── uploads/                    # Backend server files
│   ├── interim/               # Unassigned images
│   └── projects/              # Project-specific images
│       ├── project-1/
│       ├── project-2/
│       └── ...
├── frontend/
│   └── public/
│       └── uploads/            # React dev server files
│           ├── interim/
│           └── projects/
│               ├── project-1/
│               ├── project-2/
│               └── ...
└── ...
```

## Usage Workflow

### 1. **Upload Images**
1. Click "Add Images" button
2. Drag & drop images or click to select files
3. **Optional**: Select a project for direct assignment
4. Review selected files in the upload dialog
5. Click "Upload Images" to process and optimize
6. Images are automatically saved to both backend and frontend locations

### 2. **Organize Images**
1. Use the filter dropdown to view specific images:
   - **All Images**: View all uploaded images
   - **Unassigned**: View images not assigned to any project
   - **Project-Specific**: View images assigned to a specific project
2. Click "Edit" on any image card
3. Assign to a project (moves file to project folder)
4. Add tags and categories
5. Update description and alt text
6. Save changes

### 3. **Project Assignment**
- **From Media Admin**: Edit image → Assign to project
- **From Project Admin**: Add media → Select from available images
- **During Upload**: Select project in upload modal for direct assignment
- **Automatic Movement**: Files are moved between folders based on project assignment

## API Integration

### Upload Image
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('optimize', 'true');
formData.append('format', 'webp');
formData.append('project', 'project-id'); // Optional

const response = await fetch('/api/media/upload', {
  method: 'POST',
  body: formData
});
```

### Move Image Between Projects
```javascript
const response = await fetch(`/api/media/${imageId}/move`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    oldProject: 'project-1',
    newProject: 'project-2'
  })
});
```

### Delete Image
```javascript
const response = await fetch(`/api/media/${imageId}`, {
  method: 'DELETE'
});
```

## Data Schema

### Media Item Structure
```json
{
  "id": "media-uuid",
  "filename": "original-name.jpg",
  "path": "/uploads/projects/project-1/optimized-image.webp",
  "description": "Image description",
  "alt": "Accessibility alt text",
  "dimensions": {
    "width": 1920,
    "height": 1080
  },
  "type": "image",
  "format": "webp",
  "size": "245KB",
  "project": "project-1",
  "category": "gallery",
  "tags": ["web", "design", "ui"],
  "metadata": {
    "created": "2024-01-01T00:00:00.000Z",
    "modified": "2024-01-01T00:00:00.000Z",
    "author": "",
    "license": ""
  }
}
```

## Dependencies

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "multer": "^1.4.5-lts.1",
  "sharp": "^0.32.6",
  "uuid": "^9.0.1"
}
```

### Frontend Configuration
```json
{
  "proxy": "http://localhost:3001"
}
```

### Key Libraries
- **Sharp**: Image processing and optimization
- **Multer**: File upload handling
- **UUID**: Unique file naming
- **Express**: API server

## Installation

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Start the Backend Server**
   ```bash
   npm start
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Start the Frontend Development Server**
   ```bash
   npm start
   ```

5. **Access the Interface**
   - Navigate to the admin panel
   - Go to Media Management
   - Start uploading and organizing images

## Server Configuration

### Backend Server (Port 3001)
- **API Endpoints**: Handles all data operations
- **File Storage**: Serves files from `/uploads/` directory
- **Image Processing**: Optimizes and converts images
- **Database Simulation**: Manages JSON file operations

### Frontend Development Server (Port 3000)
- **Static File Serving**: Serves files from `public/` directory
- **Proxy Configuration**: Routes API calls to backend
- **React Development**: Hot reloading and development tools

### Dual File Storage System
- **Backend Location**: `/uploads/` for API server
- **Frontend Location**: `/frontend/public/uploads/` for React dev server
- **Synchronization**: Files saved to both locations automatically
- **Path Resolution**: Images accessible from both servers

## Security Features

- **File Type Validation**: Only image files allowed
- **File Size Limits**: 10MB maximum per file
- **Unique Naming**: UUID-based filenames prevent conflicts
- **Path Sanitization**: Secure file path handling
- **Error Handling**: Graceful failure recovery

## Performance Optimizations

- **WebP Conversion**: Automatic modern format conversion
- **Quality Optimization**: 80% quality balance for size/quality
- **Memory Storage**: Efficient buffer-based processing
- **Progress Tracking**: Real-time upload feedback
- **Bulk Operations**: Efficient batch processing
- **Dual Storage**: Redundant file storage for reliability

## Troubleshooting

### Common Issues

1. **Images Not Displaying**
   - Check if both backend and frontend servers are running
   - Verify files exist in both `/uploads/` and `/frontend/public/uploads/`
   - Check browser console for 404 errors
   - Ensure proxy configuration is active

2. **Upload Fails**
   - Check file size (max 10MB)
   - Ensure file is an image format
   - Verify both servers are running
   - Check server logs for errors

3. **File Movement Errors**
   - Ensure project folders exist in both locations
   - Check file permissions
   - Verify media.json is writable
   - Check server logs for detailed errors

### Debug Commands

```bash
# Check server status
curl http://localhost:3001/api/health

# List uploads directory
ls -la uploads/

# Check frontend public uploads
ls -la frontend/public/uploads/

# Check media.json
cat frontend/src/data/media.json

# Test file access
curl http://localhost:3000/uploads/projects/project-1/image.webp
```

### Server Management

```bash
# Start backend server
cd backend && npm start

# Start frontend server
cd frontend && npm start

# Kill all Node processes (if needed)
taskkill /F /IM node.exe

# Check running processes
netstat -ano | findstr :3001
netstat -ano | findstr :3000
```

## Future Enhancements

- **Image Cropping**: Built-in crop and resize tools
- **Batch Operations**: Select multiple images for bulk actions
- **Advanced Filters**: Filter by project, category, tags
- **Search Functionality**: Full-text search across descriptions
- **Version Control**: Track image versions and changes
- **CDN Integration**: Automatic CDN upload and optimization
- **AI Tagging**: Automatic tag generation using AI
- **Image Recognition**: Duplicate detection and similarity matching
- **Thumbnail Generation**: Automatic thumbnail creation
- **Image Compression**: Advanced compression algorithms

## Contributing

When adding new features:

1. **Update Schema**: Modify media.schema.json if adding new fields
2. **Update API**: Add corresponding backend endpoints
3. **Update UI**: Modify MediaAdmin component
4. **Test Workflow**: Verify upload → organize → assign workflow
5. **Test Dual Storage**: Ensure files are saved to both locations
6. **Update Docs**: Keep this README current

## File Management Best Practices

### Upload Workflow
1. **Select Files**: Use drag & drop or file picker
2. **Assign Project**: Choose project during upload for efficiency
3. **Review**: Check file list before uploading
4. **Upload**: Process and optimize images
5. **Organize**: Edit metadata and assign to projects
6. **Filter**: Use filters to manage large collections

### File Organization
- **Interim Folder**: Temporary storage for unassigned images
- **Project Folders**: Organized by project ID
- **Naming Convention**: UUID-based for uniqueness
- **Metadata**: Rich metadata for search and organization
- **Categories**: Thumbnail, gallery, screenshot, mockup, diagram

### Performance Considerations
- **File Size**: 10MB limit per file
- **Format**: WebP for optimal compression
- **Quality**: 80% for size/quality balance
- **Batch Processing**: Efficient bulk operations
- **Caching**: Browser caching for static files

---

This system provides a robust foundation for image management that scales with your portfolio needs while maintaining the relational database simulation approach. The dual storage system ensures images are accessible from both development and production environments. 