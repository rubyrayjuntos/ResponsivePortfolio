import React, { createContext, useContext, useState, useMemo } from 'react';
import { getAllProjects, getAllTypes, getAllSkills, getAllTags, searchProjects } from '../utils/dataResolver';

const FilterContext = createContext();

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    type: [],
    tools: [],
    tags: [],
    year: null,
    status: null,
    difficulty: null
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Get all projects with resolved data
  const allProjects = getAllProjects();

  // Filter projects based on current filters
  const filteredProjects = useMemo(() => {
    let projects = allProjects;

    // Search query filter
    if (searchQuery) {
      projects = searchProjects(searchQuery);
    }

    // Apply filters
    if (filters.type.length > 0) {
      projects = projects.filter(project => 
        project.types.some(type => 
          filters.type.some(filterType => 
            type.id === filterType || type.label.toLowerCase().includes(filterType.toLowerCase())
          )
        )
      );
    }

    if (filters.tools.length > 0) {
      projects = projects.filter(project => 
        project.tools.some(tool => 
          filters.tools.some(filterTool => 
            tool.id === filterTool || tool.name.toLowerCase().includes(filterTool.toLowerCase())
          )
        )
      );
    }

    if (filters.tags.length > 0) {
      projects = projects.filter(project => 
        project.tags.some(tag => 
          filters.tags.some(filterTag => 
            tag.id === filterTag || tag.label.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      );
    }

    if (filters.year) {
      projects = projects.filter(project => project.year === filters.year);
    }

    if (filters.status) {
      projects = projects.filter(project => project.status === filters.status);
    }

    if (filters.difficulty) {
      projects = projects.filter(project => project.difficulty === filters.difficulty);
    }

    return projects;
  }, [allProjects, filters, searchQuery]);

  // Get available facets for current filtered projects
  const facets = useMemo(() => {
    const facetData = {
      types: {},
      tools: {},
      tags: {},
      years: {},
      statuses: {},
      difficulties: {}
    };

    filteredProjects.forEach(project => {
      // Count types
      project.types.forEach(type => {
        const key = type.label;
        facetData.types[key] = (facetData.types[key] || 0) + 1;
      });

      // Count tools
      project.tools.forEach(tool => {
        const key = tool.name;
        facetData.tools[key] = (facetData.tools[key] || 0) + 1;
      });

      // Count tags
      project.tags.forEach(tag => {
        const key = tag.label;
        facetData.tags[key] = (facetData.tags[key] || 0) + 1;
      });

      // Count years
      facetData.years[project.year] = (facetData.years[project.year] || 0) + 1;

      // Count statuses
      facetData.statuses[project.status] = (facetData.statuses[project.status] || 0) + 1;

      // Count difficulties
      facetData.difficulties[project.difficulty] = (facetData.difficulties[project.difficulty] || 0) + 1;
    });

    return facetData;
  }, [filteredProjects]);

  // Get all available filter options
  const filterOptions = useMemo(() => {
    const allTypes = getAllTypes();
    const allSkills = getAllSkills();
    const allTags = getAllTags();

    return {
      types: allTypes.map(type => ({
        id: type.id,
        label: type.label,
        category: type.category,
        icon: type.icon,
        color: type.color
      })),
      tools: allSkills.map(skill => ({
        id: skill.id,
        label: skill.name,
        level: skill.level,
        description: skill.description
      })),
      tags: allTags.map(tag => ({
        id: tag.id,
        label: tag.label,
        category: tag.category,
        icon: tag.icon,
        color: tag.color
      })),
      years: Array.from(new Set(allProjects.map(p => p.year))).sort((a, b) => b - a),
      statuses: ['completed', 'in-progress', 'planned', 'archived'],
      difficulties: ['beginner', 'intermediate', 'advanced', 'expert']
    };
  }, [allProjects]);

  const updateFilter = (filterType, value) => {
    setFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        // Handle array filters (types, tools, tags)
        const currentArray = prev[filterType];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        
        return {
          ...prev,
          [filterType]: newArray
        };
      } else {
        // Handle single value filters (year, status, difficulty)
        return {
          ...prev,
          [filterType]: prev[filterType] === value ? null : value
        };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      type: [],
      tools: [],
      tags: [],
      year: null,
      status: null,
      difficulty: null
    });
    setSearchQuery('');
  };

  const value = {
    filters,
    searchQuery,
    filteredProjects,
    facets,
    filterOptions,
    updateFilter,
    setSearchQuery,
    clearFilters
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}; 