import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllTypes, getAllSkills, getAllTags, getAllMedia, getAllLinks } from '../utils/dataResolver.js';

const ProjectForm = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    year: new Date().getFullYear(),
    typeIds: [],
    toolIds: [],
    tagIds: [],
    mediaIds: [],
    linkIds: [],
    highlight: false,
    emotion: '',
    status: 'completed',
    difficulty: 'intermediate',
    metadata: {
      startDate: '',
      endDate: '',
      client: '',
      team: [],
      budget: '',
      awards: [],
      metrics: {
        users: 0,
        downloads: 0,
        revenue: 0,
        performance: 0
      }
    }
  });

  const [relationshipData, setRelationshipData] = useState({
    types: [],
    skills: [],
    tags: [],
    media: [],
    links: []
  });

  useEffect(() => {
    loadRelationshipData();
    if (project) {
      setFormData(project);
    }
  }, [project]);

  const loadRelationshipData = () => {
    setRelationshipData({
      types: getAllTypes(),
      skills: getAllSkills(),
      tags: getAllTags(),
      media: getAllMedia(),
      links: getAllLinks()
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMetadataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }));
  };

  const handleMetricsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        metrics: {
          ...prev.metadata.metrics,
          [field]: value
        }
      }
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title) => {
    handleChange('title', title);
    if (!formData.slug || formData.slug === generateSlug(formData.title)) {
      handleChange('slug', generateSlug(title));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const ArraySelector = ({ 
    title, 
    items, 
    selectedItems, 
    onSelectionChange,
    searchPlaceholder = "Search...",
    maxItems = 10
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = items.filter(item => 
      (item.label || item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggle = (itemId) => {
      const newSelection = selectedItems.includes(itemId)
        ? selectedItems.filter(id => id !== itemId)
        : [...selectedItems, itemId];
      
      if (newSelection.length <= maxItems) {
        onSelectionChange(newSelection);
      }
    };

    return (
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'bold' }}>
          {title} ({selectedItems.length}/{maxItems})
        </label>
        
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="btn btn-pill"
          style={{ marginBottom: 'var(--spacing-sm)' }}
        >
          Select {title}
        </button>

        {selectedItems.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)' }}>
            {selectedItems.map(itemId => {
              const item = items.find(i => i.id === itemId);
              return item ? (
                <span
                  key={itemId}
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.label || item.name}
                  <button
                    type="button"
                    onClick={() => handleToggle(itemId)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'white', 
                      cursor: 'pointer',
                      marginLeft: 'var(--spacing-xs)'
                    }}
                  >
                    ✕
                  </button>
                </span>
              ) : null;
            })}
          </div>
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="neumorphic-raised"
              style={{
                width: '90%',
                maxWidth: '600px',
                maxHeight: '80vh',
                padding: 'var(--spacing-xl)',
                overflow: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h3>{title}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn btn-pill"
                  style={{ padding: 'var(--spacing-xs)' }}
                >
                  ✕
                </button>
              </div>

              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neumorphic-input"
                style={{ marginBottom: 'var(--spacing-lg)' }}
              />

              <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                {filteredItems.map(item => (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 'var(--spacing-sm)',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: selectedItems.includes(item.id) ? 'var(--accent-primary)' : 'transparent',
                      color: selectedItems.includes(item.id) ? 'white' : 'var(--text-primary)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleToggle(item.id)}
                      style={{ marginRight: 'var(--spacing-sm)' }}
                    />
                    <span>{item.label || item.name}</span>
                    {item.icon && <span style={{ marginLeft: 'var(--spacing-xs)' }}>{item.icon}</span>}
                  </label>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn btn-pill"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Basic Information */}
      <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Basic Information</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'bold' }}>
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="neumorphic-input"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'bold' }}>
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              className="neumorphic-input"
              pattern="^[a-z0-9-]+$"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'bold' }}>
              Subtitle *
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="neumorphic-input"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'bold' }}>
              Year *
            </label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => handleChange('year', parseInt(e.target.value))}
              className="neumorphic-input"
              min="2000"
              max="2030"
              required
            />
          </div>
        </div>

        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'bold' }}>
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="neumorphic-input"
            rows="4"
            required
          />
        </div>
      </div>

      {/* Project Details */}
      <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Project Details</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'bold' }}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="neumorphic-input"
            >
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="planned">Planned</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'bold' }}>
              Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => handleChange('difficulty', e.target.value)}
              className="neumorphic-input"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'bold' }}>
              Emotion
            </label>
            <input
              type="text"
              value={formData.emotion}
              onChange={(e) => handleChange('emotion', e.target.value)}
              className="neumorphic-input"
              placeholder="e.g., electrified nostalgia"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <input
              type="checkbox"
              id="highlight"
              checked={formData.highlight}
              onChange={(e) => handleChange('highlight', e.target.checked)}
            />
            <label htmlFor="highlight" style={{ fontWeight: 'bold' }}>
              Highlight Project
            </label>
          </div>
        </div>
      </div>

      {/* Relationships */}
      <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Relationships</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <ArraySelector
            title="Project Types"
            items={relationshipData.types}
            selectedItems={formData.typeIds}
            onSelectionChange={(value) => handleArrayChange('typeIds', value)}
            maxItems={5}
          />

          <ArraySelector
            title="Tools & Technologies"
            items={relationshipData.skills}
            selectedItems={formData.toolIds}
            onSelectionChange={(value) => handleArrayChange('toolIds', value)}
            maxItems={20}
          />

          <ArraySelector
            title="Tags"
            items={relationshipData.tags}
            selectedItems={formData.tagIds}
            onSelectionChange={(value) => handleArrayChange('tagIds', value)}
            maxItems={10}
          />

          <ArraySelector
            title="Media Assets"
            items={relationshipData.media}
            selectedItems={formData.mediaIds}
            onSelectionChange={(value) => handleArrayChange('mediaIds', value)}
            maxItems={20}
          />

          <ArraySelector
            title="Links"
            items={relationshipData.links}
            selectedItems={formData.linkIds}
            onSelectionChange={(value) => handleArrayChange('linkIds', value)}
            maxItems={10}
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-pill"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-pill"
        >
          Save Project
        </button>
      </div>
    </form>
  );
};

export default ProjectForm; 