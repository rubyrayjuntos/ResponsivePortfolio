import React, { createContext, useContext, useState, useMemo } from 'react';
import projectsData from '../data/projects.json';

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
    medium: null,
    type: [],
    tools: [],
    tags: [],
    year: null
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Get all projects
  const allProjects = projectsData.projects;

  // Filter projects based on current filters
  const filteredProjects = useMemo(() => {
    return allProjects.filter(project => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableText = [
          project.title,
          project.subtitle,
          project.description,
          ...project.type,
          ...project.tools,
          ...project.tags
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Medium filter
      if (filters.medium && !project.type.some(type => 
        type.toLowerCase().includes(filters.medium.toLowerCase())
      )) {
        return false;
      }

      // Type filter
      if (filters.type.length > 0 && !filters.type.some(filterType =>
        project.type.some(type => type.toLowerCase().includes(filterType.toLowerCase()))
      )) {
        return false;
      }

      // Tools filter
      if (filters.tools.length > 0 && !filters.tools.some(filterTool =>
        project.tools.some(tool => tool.toLowerCase().includes(filterTool.toLowerCase()))
      )) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0 && !filters.tags.some(filterTag =>
        project.tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase()))
      )) {
        return false;
      }

      // Year filter
      if (filters.year && project.year !== filters.year) {
        return false;
      }

      return true;
    });
  }, [allProjects, filters, searchQuery]);

  // Get available facets for current filtered projects
  const facets = useMemo(() => {
    const facetData = {
      type: {},
      tools: {},
      tags: {},
      year: {}
    };

    filteredProjects.forEach(project => {
      // Count types
      project.type.forEach(type => {
        facetData.type[type] = (facetData.type[type] || 0) + 1;
      });

      // Count tools
      project.tools.forEach(tool => {
        facetData.tools[tool] = (facetData.tools[tool] || 0) + 1;
      });

      // Count tags
      project.tags.forEach(tag => {
        facetData.tags[tag] = (facetData.tags[tag] || 0) + 1;
      });

      // Count years
      facetData.year[project.year] = (facetData.year[project.year] || 0) + 1;
    });

    return facetData;
  }, [filteredProjects]);

  const updateFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      medium: null,
      type: [],
      tools: [],
      tags: [],
      year: null
    });
    setSearchQuery('');
  };

  const value = {
    filters,
    searchQuery,
    filteredProjects,
    facets,
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