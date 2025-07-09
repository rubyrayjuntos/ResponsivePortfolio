/**
 * Image Optimization Utility
 * Handles resizing, compression, and format conversion for portfolio images
 */

// Image specifications for different use cases
export const IMAGE_SPECS = {
  thumbnail: {
    width: 400,
    height: 300,
    aspectRatio: 4/3,
    maxSize: 100, // KB
    quality: 0.85
  },
  gallery: {
    width: 1200,
    height: 800,
    aspectRatio: 3/2,
    maxSize: 300, // KB
    quality: 0.85
  },
  hero: {
    width: 1920,
    height: 600,
    aspectRatio: 16/5,
    maxSize: 500, // KB
    quality: 0.85
  },
  profile: {
    width: 600,
    height: 600,
    aspectRatio: 1/1,
    maxSize: 150, // KB
    quality: 0.85
  }
};

/**
 * Calculate optimal dimensions while maintaining aspect ratio
 */
export const calculateOptimalDimensions = (originalWidth, originalHeight, targetSpec) => {
  const { width: maxWidth, height: maxHeight, aspectRatio } = targetSpec;
  
  // Calculate current aspect ratio
  const currentRatio = originalWidth / originalHeight;
  
  let newWidth, newHeight;
  
  if (currentRatio > aspectRatio) {
    // Image is wider than target ratio
    newWidth = Math.min(originalWidth, maxWidth);
    newHeight = newWidth / aspectRatio;
  } else {
    // Image is taller than target ratio
    newHeight = Math.min(originalHeight, maxHeight);
    newWidth = newHeight * aspectRatio;
  }
  
  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight)
  };
};

/**
 * Create a canvas with the specified dimensions
 */
const createCanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

/**
 * Draw image on canvas with optimal quality settings
 */
const drawImageOnCanvas = (canvas, img, x = 0, y = 0, width = null, height = null) => {
  const ctx = canvas.getContext('2d');
  
  // Enable image smoothing for better quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  const drawWidth = width || canvas.width;
  const drawHeight = height || canvas.height;
  
  ctx.drawImage(img, x, y, drawWidth, drawHeight);
};

/**
 * Convert canvas to blob with specified format and quality
 */
const canvasToBlob = (canvas, format = 'webp', quality = 0.85) => {
  return new Promise((resolve) => {
    const mimeType = format === 'webp' ? 'image/webp' : 'image/jpeg';
    canvas.toBlob(resolve, mimeType, quality);
  });
};

/**
 * Optimize image according to specifications
 */
export const optimizeImage = async (file, spec = 'gallery', format = 'webp') => {
  return new Promise((resolve) => {
    const img = new Image();
    const targetSpec = IMAGE_SPECS[spec];
    
    img.onload = async () => {
      try {
        // Calculate optimal dimensions
        const { width, height } = calculateOptimalDimensions(
          img.naturalWidth, 
          img.naturalHeight, 
          targetSpec
        );
        
        // Create canvas with optimal dimensions
        const canvas = createCanvas(width, height);
        
        // Draw image on canvas
        drawImageOnCanvas(canvas, img, 0, 0, width, height);
        
        // Convert to blob with specified quality
        const blob = await canvasToBlob(canvas, format, targetSpec.quality);
        
        // Create optimized file
        const optimizedFile = new File([blob], 
          file.name.replace(/\.[^/.]+$/, `.${format}`), 
          { type: `image/${format}` }
        );
        
        resolve({
          file: optimizedFile,
          dimensions: { width, height },
          size: Math.round(blob.size / 1024), // Size in KB
          format: format
        });
        
      } catch (error) {
        console.error('Image optimization error:', error);
        resolve({
          file: file,
          dimensions: { width: img.naturalWidth, height: img.naturalHeight },
          size: Math.round(file.size / 1024),
          format: file.name.split('.').pop()
        });
      }
    };
    
    img.onerror = () => {
      console.error('Failed to load image for optimization');
      resolve({
        file: file,
        dimensions: { width: 0, height: 0 },
        size: Math.round(file.size / 1024),
        format: file.name.split('.').pop()
      });
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Optimize multiple images with progress tracking
 */
export const optimizeImages = async (files, spec = 'gallery', format = 'webp', onProgress = null) => {
  const results = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Report progress
    if (onProgress) {
      onProgress((i / files.length) * 100);
    }
    
    // Optimize image
    const result = await optimizeImage(file, spec, format);
    results.push(result);
    
    // Small delay to prevent blocking
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  // Report completion
  if (onProgress) {
    onProgress(100);
  }
  
  return results;
};

/**
 * Generate multiple sizes for responsive images
 */
export const generateResponsiveImages = async (file, onProgress = null) => {
  const results = {};
  
  // Generate different sizes
  const sizes = [
    { name: 'thumbnail', spec: 'thumbnail' },
    { name: 'gallery', spec: 'gallery' },
    { name: 'hero', spec: 'hero' }
  ];
  
  for (let i = 0; i < sizes.length; i++) {
    const { name, spec } = sizes[i];
    
    // Report progress
    if (onProgress) {
      onProgress((i / sizes.length) * 100);
    }
    
    // Optimize for this size
    const result = await optimizeImage(file, spec, 'webp');
    results[name] = result;
  }
  
  // Report completion
  if (onProgress) {
    onProgress(100);
  }
  
  return results;
};

/**
 * Check if WebP is supported
 */
export const isWebPSupported = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

/**
 * Get optimal format based on browser support
 */
export const getOptimalFormat = () => {
  return isWebPSupported() ? 'webp' : 'jpg';
};

/**
 * Validate image file
 */
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.');
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large. Please upload images smaller than 10MB.');
  }
  
  return true;
};

/**
 * Get file extension from format
 */
export const getFileExtension = (format) => {
  const extensions = {
    'webp': 'webp',
    'jpg': 'jpg',
    'jpeg': 'jpg',
    'png': 'png'
  };
  return extensions[format] || 'webp';
};

/**
 * Generate unique filename
 */
export const generateUniqueFilename = (originalName, format = 'webp') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(format);
  const baseName = originalName.replace(/\.[^/.]+$/, '');
  return `${baseName}-${timestamp}-${random}.${extension}`;
}; 