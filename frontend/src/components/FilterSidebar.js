import React, { useState } from 'react';
import { useFilter } from '../context/FilterContext';

const FilterSidebar = () => {
  const { filters, searchQuery, facets, updateFilter, setSearchQuery } = useFilter();
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    type: true,
    tools: true,
    tags: false,
    year: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleMultiSelect = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateFilter(filterType, newValues);
  };

  const handleSingleSelect = (filterType, value) => {
    const currentValue = filters[filterType];
    const newValue = currentValue === value ? null : value;
    updateFilter(filterType, newValue);
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

  const CheckboxList = ({ items, selectedItems, onToggle, showCounts = true }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
      {Object.entries(items).map(([item, count]) => (
        <label key={item} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--spacing-sm)',
          cursor: 'pointer',
          fontSize: '0.9rem'
        }}>
          <input
            type="checkbox"
            checked={selectedItems.includes(item)}
            onChange={() => onToggle(item)}
            style={{ 
              width: '16px', 
              height: '16px',
              accentColor: 'var(--accent-primary)'
            }}
          />
          <span style={{ flex: '1' }}>{item}</span>
          {showCounts && (
            <span style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.8rem',
              backgroundColor: 'var(--bg-secondary)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)'
            }}>
              {count}
            </span>
          )}
        </label>
      ))}
    </div>
  );

  const RadioList = ({ items, selectedItem, onSelect, showCounts = true }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
      {Object.entries(items).map(([item, count]) => (
        <label key={item} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--spacing-sm)',
          cursor: 'pointer',
          fontSize: '0.9rem'
        }}>
          <input
            type="radio"
            name="year"
            checked={selectedItem === item}
            onChange={() => onSelect(item)}
            style={{ 
              width: '16px', 
              height: '16px',
              accentColor: 'var(--accent-primary)'
            }}
          />
          <span style={{ flex: '1' }}>{item}</span>
          {showCounts && (
            <span style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.8rem',
              backgroundColor: 'var(--bg-secondary)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)'
            }}>
              {count}
            </span>
          )}
        </label>
      ))}
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
        isExpanded={expandedSections.type}
        onToggle={() => toggleSection('type')}
      >
        <CheckboxList
          items={facets.type}
          selectedItems={filters.type}
          onToggle={(value) => handleMultiSelect('type', value)}
        />
      </FilterSection>

      {/* Tools & Technologies */}
      <FilterSection 
        title="Tools & Technologies" 
        isExpanded={expandedSections.tools}
        onToggle={() => toggleSection('tools')}
      >
        <CheckboxList
          items={facets.tools}
          selectedItems={filters.tools}
          onToggle={(value) => handleMultiSelect('tools', value)}
        />
      </FilterSection>

      {/* Tags */}
      <FilterSection 
        title="Tags" 
        isExpanded={expandedSections.tags}
        onToggle={() => toggleSection('tags')}
      >
        <CheckboxList
          items={facets.tags}
          selectedItems={filters.tags}
          onToggle={(value) => handleMultiSelect('tags', value)}
        />
      </FilterSection>

      {/* Year */}
      <FilterSection 
        title="Year" 
        isExpanded={expandedSections.year}
        onToggle={() => toggleSection('year')}
      >
        <RadioList
          items={facets.year}
          selectedItem={filters.year}
          onSelect={(value) => handleSingleSelect('year', value)}
        />
      </FilterSection>

      {/* Active Filters Summary */}
      {(filters.type.length > 0 || filters.tools.length > 0 || filters.tags.length > 0 || filters.year) && (
        <div className="neumorphic-inset" style={{ 
          padding: 'var(--spacing-md)',
          marginTop: 'var(--spacing-lg)'
        }}>
          <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem' }}>Active Filters:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
            {filters.type.map(type => (
              <span key={type} style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--bg-primary)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem'
              }}>
                {type}
              </span>
            ))}
            {filters.tools.map(tool => (
              <span key={tool} style={{
                backgroundColor: 'var(--accent-secondary)',
                color: 'var(--bg-primary)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem'
              }}>
                {tool}
              </span>
            ))}
            {filters.tags.map(tag => (
              <span key={tag} style={{
                backgroundColor: 'var(--text-secondary)',
                color: 'var(--bg-primary)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem'
              }}>
                {tag}
              </span>
            ))}
            {filters.year && (
              <span style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--bg-primary)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem'
              }}>
                {filters.year}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar; 