/**
 * Category Mapper
 * Maps projects to the three main categories: art, code, writing
 */

// Define category mappings based on actual data
const CATEGORY_MAPPINGS = {
  // ART category
  art: {
    types: [
      'creative-technology',
      'creative-tools',
      'game-design',
      'branding-system'
    ],
    tags: [
      'generative',
      'creative',
      'visual',
      'design',
      'illustration',
      'animation',
      'photography',
      'digital-art',
      'playful',
      'retrofuturism',
      'retro',
      'arcade'
    ],
    keywords: [
      'creative',
      'visual',
      'artistic',
      'design',
      'aesthetic',
      'branding',
      'identity',
      'game',
      'art'
    ]
  },

  // CODE category
  code: {
    types: [
      'frontend-development',
      'pwa',
      'full-stack-app',
      'platform-design'
    ],
    tags: [
      'development',
      'programming',
      'web',
      'mobile',
      'api',
      'database',
      'frontend',
      'backend',
      'full-stack',
      'pwa',
      'offline-first',
      'interactive'
    ],
    keywords: [
      'development',
      'programming',
      'code',
      'web',
      'app',
      'software',
      'technical',
      'engineering',
      'mobile',
      'frontend',
      'backend'
    ]
  },

  // WRITING category
  writing: {
    types: [
      'conversational-ai',
      'ai-collaboration',
      'ai-workflow'
    ],
    tags: [
      'writing',
      'narrative',
      'storytelling',
      'content',
      'copywriting',
      'creative-writing',
      'poetry',
      'script',
      'ai',
      'collaborative',
      'multi-agent'
    ],
    keywords: [
      'writing',
      'narrative',
      'story',
      'content',
      'copy',
      'text',
      'words',
      'communication',
      'ai',
      'conversation'
    ]
  }
};

/**
 * Simple function to filter projects by direct category field
 */
export const getProjectsByDirectCategory = (projects, category) => {
  return projects.filter(project => project.category === category);
};

/**
 * Get category statistics using direct category field
 */
export const getCategoryStatsDirect = (projects) => {
  const stats = {
    art: { count: 0, projects: [] },
    code: { count: 0, projects: [] },
    writing: { count: 0, projects: [] }
  };

  projects.forEach(project => {
    if (project.category && stats[project.category]) {
      stats[project.category].count++;
      stats[project.category].projects.push(project);
    }
  });

  return stats;
};

/**
 * Determine the primary category for a project
 */
export const getProjectCategory = (project) => {
  const scores = {
    art: 0,
    code: 0,
    writing: 0
  };

  // Score based on types (using resolved type objects)
  project.types?.forEach(type => {
    Object.entries(CATEGORY_MAPPINGS).forEach(([category, mapping]) => {
      if (mapping.types.includes(type.id)) {
        scores[category] += 3; // High weight for types
      }
    });
  });

  // Score based on tags (using resolved tag objects)
  project.tags?.forEach(tag => {
    Object.entries(CATEGORY_MAPPINGS).forEach(([category, mapping]) => {
      if (mapping.tags.includes(tag.label.toLowerCase())) {
        scores[category] += 2; // Medium weight for tags
      }
    });
  });

  // Score based on keywords in title, subtitle, description
  const textContent = `${project.title} ${project.subtitle} ${project.description}`.toLowerCase();
  Object.entries(CATEGORY_MAPPINGS).forEach(([category, mapping]) => {
    mapping.keywords.forEach(keyword => {
      if (textContent.includes(keyword.toLowerCase())) {
        scores[category] += 1; // Low weight for keywords
      }
    });
  });

  // Return the category with the highest score
  const maxScore = Math.max(...Object.values(scores));
  const primaryCategory = Object.keys(scores).find(category => scores[category] === maxScore);
  
  return {
    category: primaryCategory || 'code', // Default to code if no clear category
    scores,
    confidence: maxScore / (Object.values(scores).reduce((a, b) => a + b, 0) || 1)
  };
};

/**
 * Get all projects for a specific category
 */
export const getProjectsByCategory = (projects, category) => {
  const filtered = projects.filter(project => {
    const projectCategory = getProjectCategory(project);
    return projectCategory.category === category;
  });
  
  return filtered;
};

/**
 * Get category statistics
 */
export const getCategoryStats = (projects) => {
  const stats = {
    art: { count: 0, projects: [] },
    code: { count: 0, projects: [] },
    writing: { count: 0, projects: [] }
  };

  projects.forEach(project => {
    const { category } = getProjectCategory(project);
    stats[category].count++;
    stats[category].projects.push(project);
  });

  return stats;
};

/**
 * Get category display info
 */
export const getCategoryInfo = (category) => {
  const categoryInfo = {
    art: {
      label: 'ART',
      subtitle: 'Creative',
      description: 'Visual art, design, and creative technology',
      icon: '🎨',
      color: '#FF6B6B'
    },
    code: {
      label: 'CODE',
      subtitle: 'Development',
      description: 'Software development and technical projects',
      icon: '💻',
      color: '#4ECDC4'
    },
    writing: {
      label: 'WRITE',
      subtitle: 'Narrative',
      description: 'Writing, storytelling, and content creation',
      icon: '✍️',
      color: '#96CEB4'
    }
  };

  return categoryInfo[category] || categoryInfo.code;
};

/**
 * Get all category info
 */
export const getAllCategories = () => {
  return ['art', 'code', 'writing'].map(category => ({
    id: category,
    ...getCategoryInfo(category)
  }));
}; 

/**
 * Returns the primary category tag for a project: 'art', 'code', or 'writing'.
 * @param {Object} project - The resolved project object (with tags as objects)
 * @returns {string|null} - The primary category tag id, or null if not found
 */
export function getPrimaryCategoryTag(project) {
  if (!project || !project.tags) return null;
  const specialTags = ['art', 'code', 'writing'];
  const found = project.tags.find(tag => specialTags.includes(tag.id));
  return found ? found.id : null;
} 