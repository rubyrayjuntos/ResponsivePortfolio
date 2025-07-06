import { validateAllData } from '../schemas/index.js';
import { getAllProjects, getAllTypes, getAllSkills, getAllTags, getAllMedia, getAllLinks } from './dataResolver.js';

/**
 * Utility functions for the Data Management System
 */

// Data validation utilities
export const validateDataIntegrity = async () => {
  try {
    const validation = await validateAllData();
    return {
      isValid: validation.isValid,
      errors: validation.errors || [],
      warnings: validation.warnings || []
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [error.message],
      warnings: []
    };
  }
};

// Relationship validation
export const validateRelationships = () => {
  const projects = getAllProjects();
  const types = getAllTypes();
  const skills = getAllSkills();
  const tags = getAllTags();
  const media = getAllMedia();
  const links = getAllLinks();

  const errors = [];
  const warnings = [];

  // Check for orphaned references
  projects.forEach(project => {
    // Check typeIds
    project.typeIds?.forEach(typeId => {
      if (!types.find(t => t.id === typeId)) {
        errors.push(`Project "${project.title}" references non-existent type: ${typeId}`);
      }
    });

    // Check toolIds
    project.toolIds?.forEach(toolId => {
      const skillExists = skills.some(category => 
        category.skills?.some(skill => skill.id === toolId)
      );
      if (!skillExists) {
        errors.push(`Project "${project.title}" references non-existent tool: ${toolId}`);
      }
    });

    // Check tagIds
    project.tagIds?.forEach(tagId => {
      if (!tags.find(t => t.id === tagId)) {
        errors.push(`Project "${project.title}" references non-existent tag: ${tagId}`);
      }
    });

    // Check mediaIds
    project.mediaIds?.forEach(mediaId => {
      if (!media.find(m => m.id === mediaId)) {
        errors.push(`Project "${project.title}" references non-existent media: ${mediaId}`);
      }
    });

    // Check linkIds
    project.linkIds?.forEach(linkId => {
      if (!links.find(l => l.id === linkId)) {
        errors.push(`Project "${project.title}" references non-existent link: ${linkId}`);
      }
    });
  });

  // Check for unused items
  const usedTypeIds = new Set();
  const usedToolIds = new Set();
  const usedTagIds = new Set();
  const usedMediaIds = new Set();
  const usedLinkIds = new Set();

  projects.forEach(project => {
    project.typeIds?.forEach(id => usedTypeIds.add(id));
    project.toolIds?.forEach(id => usedToolIds.add(id));
    project.tagIds?.forEach(id => usedTagIds.add(id));
    project.mediaIds?.forEach(id => usedMediaIds.add(id));
    project.linkIds?.forEach(id => usedLinkIds.add(id));
  });

  // Find unused types
  types.forEach(type => {
    if (!usedTypeIds.has(type.id)) {
      warnings.push(`Unused type: ${type.label} (${type.id})`);
    }
  });

  // Find unused skills
  skills.forEach(category => {
    category.skills?.forEach(skill => {
      if (!usedToolIds.has(skill.id)) {
        warnings.push(`Unused skill: ${skill.name} (${skill.id})`);
      }
    });
  });

  // Find unused tags
  tags.forEach(tag => {
    if (!usedTagIds.has(tag.id)) {
      warnings.push(`Unused tag: ${tag.label} (${tag.id})`);
    }
  });

  // Find unused media
  media.forEach(mediaItem => {
    if (!usedMediaIds.has(mediaItem.id)) {
      warnings.push(`Unused media: ${mediaItem.filename} (${mediaItem.id})`);
    }
  });

  // Find unused links
  links.forEach(link => {
    if (!usedLinkIds.has(link.id)) {
      warnings.push(`Unused link: ${link.label} (${link.id})`);
    }
  });

  return { errors, warnings };
};

// Data export utilities
export const exportData = (type = 'all') => {
  const data = {};
  
  if (type === 'all' || type === 'projects') {
    data.projects = getAllProjects();
  }
  if (type === 'all' || type === 'types') {
    data.types = getAllTypes();
  }
  if (type === 'all' || type === 'skills') {
    data.skills = getAllSkills();
  }
  if (type === 'all' || type === 'tags') {
    data.tags = getAllTags();
  }
  if (type === 'all' || type === 'media') {
    data.media = getAllMedia();
  }
  if (type === 'all' || type === 'links') {
    data.links = getAllLinks();
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio-data-${type}-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Data import utilities
export const importData = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

// Image optimization utilities
export const optimizeImageFile = async (file, options = {}) => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    format = 'webp'
  } = options;

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and optimize
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, `.${format}`), {
          type: `image/${format}`
        });
        resolve(optimizedFile);
      }, `image/${format}`, quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// Generate unique IDs
export const generateId = (prefix = 'item', existingIds = []) => {
  let id = `${prefix}-${Date.now()}`;
  let counter = 1;
  
  while (existingIds.includes(id)) {
    id = `${prefix}-${Date.now()}-${counter}`;
    counter++;
  }
  
  return id;
};

// Generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate image file
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Please upload JPG, PNG, WebP, or GIF.' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: 'File too large. Maximum size is 10MB.' };
  }

  return { isValid: true };
};

// Get data statistics
export const getDataStats = () => {
  const projects = getAllProjects();
  const types = getAllTypes();
  const skills = getAllSkills();
  const tags = getAllTags();
  const media = getAllMedia();
  const links = getAllLinks();

  const skillCount = skills.reduce((total, category) => total + (category.skills?.length || 0), 0);

  return {
    projects: projects.length,
    types: types.length,
    skills: skillCount,
    tags: tags.length,
    media: media.length,
    links: links.length,
    highlightedProjects: projects.filter(p => p.highlight).length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    inProgressProjects: projects.filter(p => p.status === 'in-progress').length
  };
};

// Search utilities
export const searchData = (query, type = 'all') => {
  const results = {};
  const searchTerm = query.toLowerCase();

  if (type === 'all' || type === 'projects') {
    const projects = getAllProjects();
    results.projects = projects.filter(project =>
      project.title.toLowerCase().includes(searchTerm) ||
      project.subtitle.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm)
    );
  }

  if (type === 'all' || type === 'types') {
    const types = getAllTypes();
    results.types = types.filter(type =>
      type.label.toLowerCase().includes(searchTerm) ||
      type.description.toLowerCase().includes(searchTerm)
    );
  }

  if (type === 'all' || type === 'skills') {
    const skills = getAllSkills();
    results.skills = skills.map(category => ({
      ...category,
      skills: category.skills?.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm) ||
        skill.description.toLowerCase().includes(searchTerm)
      ) || []
    })).filter(category => category.skills.length > 0);
  }

  if (type === 'all' || type === 'tags') {
    const tags = getAllTags();
    results.tags = tags.filter(tag =>
      tag.label.toLowerCase().includes(searchTerm) ||
      tag.description.toLowerCase().includes(searchTerm)
    );
  }

  if (type === 'all' || type === 'media') {
    const media = getAllMedia();
    results.media = media.filter(item =>
      item.filename.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.alt.toLowerCase().includes(searchTerm)
    );
  }

  if (type === 'all' || type === 'links') {
    const links = getAllLinks();
    results.links = links.filter(link =>
      link.label.toLowerCase().includes(searchTerm) ||
      link.url.toLowerCase().includes(searchTerm)
    );
  }

  return results;
}; 