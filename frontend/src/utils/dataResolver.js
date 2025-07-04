// Data resolver utilities for normalized portfolio data
import projectsData from '../data/projects.json';
import typesData from '../data/types.json';
import skillsData from '../data/skills.json';
import tagsData from '../data/tags.json';
import mediaData from '../data/media.json';
import linksData from '../data/links.json';

// Create lookup maps for efficient resolution
const createLookupMap = (data, key = 'id') => {
  const map = new Map();
  if (Array.isArray(data)) {
    data.forEach(item => map.set(item[key], item));
  } else if (data[key + 's']) {
    data[key + 's'].forEach(item => map.set(item[key], item));
  }
  return map;
};

// Initialize lookup maps
const typesMap = createLookupMap(typesData.types);
const skillsMap = createLookupMap(skillsData.skills.flatMap(cat => cat.skills));
const tagsMap = createLookupMap(tagsData.tags);
const mediaMap = createLookupMap(mediaData.media);
const linksMap = createLookupMap(linksData.links);

/**
 * Resolve project relationships and return enriched project data
 */
export const resolveProject = (project) => {
  if (!project) return null;

  return {
    ...project,
    types: project.typeIds?.map(id => typesMap.get(id)).filter(Boolean) || [],
    tools: project.toolIds?.map(id => skillsMap.get(id)).filter(Boolean) || [],
    tags: project.tagIds?.map(id => tagsMap.get(id)).filter(Boolean) || [],
    media: project.mediaIds?.map(id => mediaMap.get(id)).filter(Boolean) || [],
    links: project.linkIds?.map(id => linksMap.get(id)).filter(Boolean) || [],
    // Legacy support
    type: project.typeIds?.map(id => typesMap.get(id)?.label).filter(Boolean) || [],
    legacyTools: project.toolIds?.map(id => skillsMap.get(id)?.name).filter(Boolean) || [],
    legacyTags: project.tagIds?.map(id => tagsMap.get(id)?.label).filter(Boolean) || [],
    legacyMedia: {
      thumbnail: mediaMap.get(project.mediaIds?.[0])?.path + mediaMap.get(project.mediaIds?.[0])?.filename || '',
      gallery: project.mediaIds?.slice(1).map(id => mediaMap.get(id)?.path + mediaMap.get(id)?.filename).filter(Boolean) || []
    },
    legacyLinks: project.linkIds?.reduce((acc, id) => {
      const link = linksMap.get(id);
      if (link) {
        acc[link.type] = link.url;
      }
      return acc;
    }, {}) || {}
  };
};

/**
 * Get all projects with resolved relationships
 */
export const getAllProjects = () => {
  return projectsData.projects.map(resolveProject);
};

/**
 * Get a single project by ID with resolved relationships
 */
export const getProjectById = (id) => {
  const project = projectsData.projects.find(p => p.id === id || p.slug === id);
  return resolveProject(project);
};

/**
 * Get projects filtered by criteria
 */
export const getProjectsByFilter = (filters = {}) => {
  let projects = getAllProjects();

  if (filters.type) {
    projects = projects.filter(p => 
      p.types.some(type => type.id === filters.type || type.label === filters.type)
    );
  }

  if (filters.tool) {
    projects = projects.filter(p => 
      p.tools.some(tool => tool.id === filters.tool || tool.name === filters.tool)
    );
  }

  if (filters.tag) {
    projects = projects.filter(p => 
      p.tags.some(tag => tag.id === filters.tag || tag.label === filters.tag)
    );
  }

  if (filters.highlight) {
    projects = projects.filter(p => p.highlight);
  }

  if (filters.status) {
    projects = projects.filter(p => p.status === filters.status);
  }

  return projects;
};

/**
 * Get all types
 */
export const getAllTypes = () => {
  return typesData.types;
};

/**
 * Get all skills/tools
 */
export const getAllSkills = () => {
  return skillsData.skills.flatMap(cat => cat.skills);
};

/**
 * Get skills by category
 */
export const getSkillsByCategory = (category) => {
  const skillCategory = skillsData.skills.find(cat => 
    cat.category.toLowerCase() === category.toLowerCase()
  );
  return skillCategory?.skills || [];
};

/**
 * Get all tags
 */
export const getAllTags = () => {
  return tagsData.tags;
};

/**
 * Get tags by category
 */
export const getTagsByCategory = (category) => {
  return tagsData.tags.filter(tag => tag.category === category);
};

/**
 * Get all media
 */
export const getAllMedia = () => {
  return mediaData.media;
};

/**
 * Get media by project
 */
export const getMediaByProject = (projectId) => {
  return mediaData.media.filter(media => media.project === projectId);
};

/**
 * Get all links
 */
export const getAllLinks = () => {
  return linksData.links;
};

/**
 * Get links by project
 */
export const getLinksByProject = (projectId) => {
  return linksData.links.filter(link => link.project === projectId);
};

/**
 * Get personal links (not project-specific)
 */
export const getPersonalLinks = () => {
  return linksData.links.filter(link => !link.project);
};

/**
 * Search projects by text
 */
export const searchProjects = (query) => {
  const projects = getAllProjects();
  const searchTerm = query.toLowerCase();

  return projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm) ||
    project.subtitle.toLowerCase().includes(searchTerm) ||
    project.description.toLowerCase().includes(searchTerm) ||
    project.tags.some(tag => tag.label.toLowerCase().includes(searchTerm)) ||
    project.tools.some(tool => tool.name.toLowerCase().includes(searchTerm)) ||
    project.types.some(type => type.label.toLowerCase().includes(searchTerm))
  );
};

/**
 * Get project statistics
 */
export const getProjectStats = () => {
  const projects = getAllProjects();
  
  return {
    total: projects.length,
    highlighted: projects.filter(p => p.highlight).length,
    byStatus: projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {}),
    byDifficulty: projects.reduce((acc, p) => {
      acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
      return acc;
    }, {}),
    byYear: projects.reduce((acc, p) => {
      acc[p.year] = (acc[p.year] || 0) + 1;
      return acc;
    }, {})
  };
};

/**
 * Validate data relationships
 */
export const validateRelationships = () => {
  const errors = [];
  const warnings = [];

  // Check for orphaned references
  projectsData.projects.forEach(project => {
    project.typeIds?.forEach(typeId => {
      if (!typesMap.has(typeId)) {
        errors.push(`Project ${project.id}: Invalid type ID "${typeId}"`);
      }
    });

    project.toolIds?.forEach(toolId => {
      if (!skillsMap.has(toolId)) {
        errors.push(`Project ${project.id}: Invalid tool ID "${toolId}"`);
      }
    });

    project.tagIds?.forEach(tagId => {
      if (!tagsMap.has(tagId)) {
        errors.push(`Project ${project.id}: Invalid tag ID "${tagId}"`);
      }
    });

    project.mediaIds?.forEach(mediaId => {
      if (!mediaMap.has(mediaId)) {
        warnings.push(`Project ${project.id}: Invalid media ID "${mediaId}"`);
      }
    });

    project.linkIds?.forEach(linkId => {
      if (!linksMap.has(linkId)) {
        warnings.push(`Project ${project.id}: Invalid link ID "${linkId}"`);
      }
    });
  });

  return { errors, warnings, isValid: errors.length === 0 };
};

const dataResolver = {
  resolveProject,
  getAllProjects,
  getProjectById,
  getProjectsByFilter,
  getAllTypes,
  getAllSkills,
  getSkillsByCategory,
  getAllTags,
  getTagsByCategory,
  getAllMedia,
  getMediaByProject,
  getAllLinks,
  getLinksByProject,
  getPersonalLinks,
  searchProjects,
  getProjectStats,
  validateRelationships
};

export default dataResolver; 