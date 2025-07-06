/**
 * Utility functions for handling images in React
 */

/**
 * Get the correct path for an image based on its location
 * @param {string} path - The path from media.json
 * @param {string} filename - The filename from media.json
 * @returns {string} - The correct URL for the image
 */
export const getImageUrl = (path, filename) => {
  if (!path || !filename) return '';
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Construct the full path
  const fullPath = `${cleanPath}${filename}`;
  
  // For development, we need to use the public URL
  if (process.env.NODE_ENV === 'development') {
    return `/${fullPath}`;
  }
  
  // For production, use the public URL
  return `${process.env.PUBLIC_URL}/${fullPath}`;
};

/**
 * Get thumbnail URL for a project
 * @param {Object} project - The project object
 * @returns {string} - The thumbnail URL
 */
export const getProjectThumbnail = (project) => {
  if (!project || !project.media || project.media.length === 0) {
    return '';
  }
  
  // Try to find a thumbnail
  const thumbnail = project.media.find(m => m.category === 'thumbnail') || project.media[0];
  
  if (thumbnail) {
    return getImageUrl(thumbnail.path, thumbnail.filename);
  }
  
  return '';
};

/**
 * Get gallery images for a project
 * @param {Object} project - The project object
 * @returns {Array} - Array of gallery image URLs
 */
export const getProjectGallery = (project) => {
  if (!project || !project.media || project.media.length === 0) {
    return [];
  }
  
  return project.media
    .filter(m => m.category === 'gallery')
    .map(m => getImageUrl(m.path, m.filename));
};

/**
 * Get all images for a project
 * @param {Object} project - The project object
 * @returns {Array} - Array of all image URLs
 */
export const getProjectImages = (project) => {
  if (!project || !project.media || project.media.length === 0) {
    return [];
  }
  
  return project.media.map(m => getImageUrl(m.path, m.filename));
}; 