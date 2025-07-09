/**
 * Bulk Image Optimizer
 * Processes all existing images in the portfolio and optimizes them
 */

import { optimizeImage, IMAGE_SPECS, generateUniqueFilename } from './imageOptimizer.js';

/**
 * Get all image files from the assets directory
 */
export const getAllImageFiles = async () => {
  try {
    // This would need to be implemented based on your file structure
    // For now, we'll return a list of known image paths
    const imagePaths = [
      // Add your image paths here
      '/src/assets/images/images/',
      '/src/assets/images/astronova-asteroids/',
      '/src/assets/images/brand-identity-workflow/',
      '/src/assets/images/cartas-del-deseo/',
      '/src/assets/images/nova-writers-conspiracy/',
      '/src/assets/images/ray-swan-portfolio/'
    ];
    
    return imagePaths;
  } catch (error) {
    console.error('Error getting image files:', error);
    return [];
  }
};

/**
 * Process a single image file
 */
export const processImageFile = async (file, spec = 'gallery', format = 'webp') => {
  try {
    // Validate file
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Invalid file type');
    }
    
    // Optimize image
    const result = await optimizeImage(file, spec, format);
    
    // Generate unique filename
    const optimizedFilename = generateUniqueFilename(file.name, format);
    
    return {
      original: {
        name: file.name,
        size: Math.round(file.size / 1024),
        dimensions: result.dimensions
      },
      optimized: {
        name: optimizedFilename,
        size: result.size,
        dimensions: result.dimensions,
        format: format,
        spec: spec
      },
      savings: {
        sizeReduction: Math.round(((file.size - result.file.size) / file.size) * 100),
        sizeSaved: Math.round((file.size - result.file.size) / 1024)
      }
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
};

/**
 * Bulk optimize all images
 */
export const bulkOptimizeImages = async (onProgress = null, onComplete = null) => {
  const results = {
    processed: 0,
    total: 0,
    optimized: [],
    errors: [],
    totalSavings: {
      sizeReduction: 0,
      sizeSaved: 0
    }
  };
  
  try {
    // Get all image files
    const imageFiles = await getAllImageFiles();
    results.total = imageFiles.length;
    
    if (results.total === 0) {
      throw new Error('No images found to process');
    }
    
    // Process each image
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      
      // Report progress
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: results.total,
          percentage: ((i + 1) / results.total) * 100,
          currentFile: file.name
        });
      }
      
      // Process image
      const result = await processImageFile(file);
      
      if (result) {
        results.optimized.push(result);
        results.processed++;
        
        // Update total savings
        results.totalSavings.sizeReduction += result.savings.sizeReduction;
        results.totalSavings.sizeSaved += result.savings.sizeSaved;
      } else {
        results.errors.push({
          file: file.name,
          error: 'Failed to process image'
        });
      }
      
      // Small delay to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Report completion
    if (onComplete) {
      onComplete(results);
    }
    
    return results;
    
  } catch (error) {
    console.error('Bulk optimization error:', error);
    if (onComplete) {
      onComplete({ ...results, error: error.message });
    }
    return results;
  }
};

/**
 * Generate optimization report
 */
export const generateOptimizationReport = (results) => {
  const report = {
    summary: {
      totalImages: results.total,
      processedImages: results.processed,
      failedImages: results.errors.length,
      averageSizeReduction: Math.round(results.totalSavings.sizeReduction / results.processed),
      totalSizeSaved: results.totalSavings.sizeSaved
    },
    details: results.optimized.map(item => ({
      original: item.original.name,
      optimized: item.optimized.name,
      sizeReduction: `${item.savings.sizeReduction}%`,
      sizeSaved: `${item.savings.sizeSaved}KB`,
      newDimensions: `${item.optimized.dimensions.width}×${item.optimized.dimensions.height}`,
      format: item.optimized.format
    })),
    errors: results.errors
  };
  
  return report;
};

/**
 * Download optimized images as zip
 */
export const downloadOptimizedImages = async (results) => {
  try {
    // This would require a zip library like JSZip
    // For now, we'll just return the optimized files
    const optimizedFiles = results.optimized.map(item => item.optimized);
    
    console.log('Optimized files ready for download:', optimizedFiles);
    return optimizedFiles;
  } catch (error) {
    console.error('Error creating download:', error);
    throw error;
  }
};

/**
 * Update media.json with optimized image data
 */
export const updateMediaData = (results, mediaData) => {
  const updatedMedia = [...mediaData.media];
  
  results.optimized.forEach(item => {
    // Find existing media entry
    const existingIndex = updatedMedia.findIndex(m => 
      m.filename === item.original.name
    );
    
    if (existingIndex !== -1) {
      // Update existing entry
      updatedMedia[existingIndex] = {
        ...updatedMedia[existingIndex],
        filename: item.optimized.name,
        dimensions: item.optimized.dimensions,
        format: item.optimized.format,
        size: `${item.optimized.size}KB`,
        optimized: true,
        originalSize: item.original.size,
        sizeReduction: item.savings.sizeReduction
      };
    } else {
      // Add new entry
      updatedMedia.push({
        id: `optimized-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        filename: item.optimized.name,
        path: '/src/assets/images/optimized/',
        description: `Optimized version of ${item.original.name}`,
        alt: `Optimized image`,
        dimensions: item.optimized.dimensions,
        type: 'image',
        format: item.optimized.format,
        size: `${item.optimized.size}KB`,
        optimized: true,
        originalSize: item.original.size,
        sizeReduction: item.savings.sizeReduction
      });
    }
  });
  
  return { media: updatedMedia };
}; 