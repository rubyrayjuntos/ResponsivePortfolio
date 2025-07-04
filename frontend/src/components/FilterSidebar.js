import React, { useState } from 'react';
import { useFilter } from '../context/FilterContext';

const FilterSidebar = () => {
  const { filters, searchQuery, facets, filterOptions, updateFilter, setSearchQuery } = useFilter();
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    types: true,
    tools: true,
    tags: false,
    year: false,
    status: false,
    difficulty: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FilterSection = ({ title, children, isExpanded, onToggle }) => (
    <div className="neumorphic-inset" style={{ 
      marginBottom: 'var(--spacing-lg)',
      padding: 'var(--spacing-lg)'
    }}>
      <button 
        className="btn"
        onClick={onToggle}
        style={{ 
          width: '100%',
          textAlign: 'left',
          padding: 0,
          marginBottom: isExpanded ? 'var(--spacing-md)' : 0,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)'
        }}
      >
        {title} {isExpanded ? '▼' : '▶'}
      </button>
      {isExpanded && children}
    </div>
  );

  const CheckboxList = ({ items, selectedItems, onToggle, showCounts = true, showIcons = false }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
      {items.map((item) => {
        const count = facets[item.id] || 0;
        const isSelected = selectedItems.includes(item.id);
        
        return (
          <label key={item.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--spacing-sm)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            padding: 'var(--spacing-xs)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isSelected ? 'var(--accent-primary)' : 'transparent',
            color: isSelected ? 'white' : 'var(--text-primary)'
          }}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(item.id)}
              style={{ 
                width: '16px', 
                height: '16px',
                accentColor: 'var(--accent-primary)'
              }}
            />
            <span style={{ flex: '1', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              {showIcons && item.icon && (
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              )}
              {item.label}
            </span>
            {showCounts && count > 0 && (
              <span style={{ 
                color: isSelected ? 'white' : 'var(--text-secondary)', 
                fontSize: '0.8rem',
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-secondary)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)'
              }}>
                {count}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );

  const RadioList = ({ items, selectedItem, onSelect, showCounts = true }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
      {items.map((item) => {
        const count = facets[item] || 0;
        const isSelected = selectedItem === item;
        
        return (
          <label key={item} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--spacing-sm)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            padding: 'var(--spacing-xs)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isSelected ? 'var(--accent-primary)' : 'transparent',
            color: isSelected ? 'white' : 'var(--text-primary)'
          }}>
            <input
              type="radio"
              name="single-select"
              checked={isSelected}
              onChange={() => onSelect(item)}
              style={{ 
                width: '16px', 
                height: '16px',
                accentColor: 'var(--accent-primary)'
              }}
            />
            <span style={{ flex: '1' }}>{item}</span>
            {showCounts && count > 0 && (
              <span style={{ 
                color: isSelected ? 'white' : 'var(--text-secondary)', 
                fontSize: '0.8rem',
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-secondary)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)'
              }}>
                {count}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );

  return (
    <div className="neumorphic-raised" style={{ 
      padding: 'var(--spacing-lg)',
      height: 'fit-content'
    }}>
      <h2 className="text-embossed" style={{ 
        marginBottom: 'var(--spacing-lg)',
        fontSize: '1.5rem'
      }}>
        Filters
      </h2>

      {/* Search */}
      <FilterSection 
        title="Search" 
        isExpanded={expandedSections.search}
        onToggle={() => toggleSection('search')}
      >
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="neumorphic-input"
          style={{ marginBottom: 'var(--spacing-sm)' }}
        />
      </FilterSection>

      {/* Project Types */}
      <FilterSection 
        title="Project Types" 
        isExpanded={expandedSections.types}
        onToggle={() => toggleSection('types')}
      >
        <CheckboxList
          items={filterOptions.types}
          selectedItems={filters.type}
          onToggle={(value) => updateFilter('type', value)}
          showIcons={true}
        />
      </FilterSection>

      {/* Tools & Technologies */}
      <FilterSection 
        title="Tools & Technologies" 
        isExpanded={expandedSections.tools}
        onToggle={() => toggleSection('tools')}
      >
        <CheckboxList
          items={filterOptions.tools}
          selectedItems={filters.tools}
          onToggle={(value) => updateFilter('tools', value)}
        />
      </FilterSection>

      {/* Tags */}
      <FilterSection 
        title="Tags" 
        isExpanded={expandedSections.tags}
        onToggle={() => toggleSection('tags')}
      >
        <CheckboxList
          items={filterOptions.tags}
          selectedItems={filters.tags}
          onToggle={(value) => updateFilter('tags', value)}
          showIcons={true}
        />
      </FilterSection>

      {/* Year */}
      <FilterSection 
        title="Year" 
        isExpanded={expandedSections.year}
        onToggle={() => toggleSection('year')}
      >
        <RadioList
          items={filterOptions.years}
          selectedItem={filters.year}
          onSelect={(value) => updateFilter('year', value)}
        />
      </FilterSection>

      {/* Status */}
      <FilterSection 
        title="Status" 
        isExpanded={expandedSections.status}
        onToggle={() => toggleSection('status')}
      >
        <RadioList
          items={filterOptions.statuses}
          selectedItem={filters.status}
          onSelect={(value) => updateFilter('status', value)}
        />
      </FilterSection>

      {/* Difficulty */}
      <FilterSection 
        title="Difficulty" 
        isExpanded={expandedSections.difficulty}
        onToggle={() => toggleSection('difficulty')}
      >
        <RadioList
          items={filterOptions.difficulties}
          selectedItem={filters.difficulty}
          onSelect={(value) => updateFilter('difficulty', value)}
        />
      </FilterSection>
    </div>
  );
};

export default FilterSidebar; 