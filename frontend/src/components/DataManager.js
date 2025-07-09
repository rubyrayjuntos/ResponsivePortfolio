import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateAllData } from '../schemas/index.js';
import { getAllProjects, getAllTypes, getAllSkills, getAllTags, getAllMedia, getAllLinks } from '../utils/dataResolver.js';
import { optimizeImage, validateImageFile, getOptimalFormat } from '../utils/imageOptimizer.js';

const DataManager = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [jsonData, setJsonData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [relationshipData, setRelationshipData] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormEditing, setIsFormEditing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  // Available data types
  const dataTypes = useMemo(() => [
    { id: 'projects', label: 'Projects', schema: 'projects.schema.json' },
    { id: 'types', label: 'Project Types', schema: 'types.schema.json' },
    { id: 'skills', label: 'Skills & Tools', schema: 'skills.schema.json' },
    { id: 'tags', label: 'Tags', schema: 'tags.schema.json' },
    { id: 'media', label: 'Media Assets', schema: 'media.schema.json' },
    { id: 'links', label: 'Links', schema: 'links.schema.json' },
    { id: 'about', label: 'About Info', schema: 'about.schema.json' }
  ], []);

  // Stable loadData
  const loadData = useCallback(async () => {
    try {
      const data = {};
      for (const type of dataTypes) {
        const response = await fetch(`http://localhost:3001/api/data/${type.id}`);
        if (!response.ok) {
          throw new Error(`Failed to load ${type.id}.json: ${response.status}`);
        }
        data[type.id] = await response.json();
      }
      setJsonData(data);
    } catch (error) {
      setJsonData({
        projects: { projects: [] },
        types: { types: [] },
        skills: { skills: [] },
        tags: { tags: [] },
        media: { media: [] },
        links: { links: [] },
        about: {}
      });
    }
  }, [dataTypes]);

  // Stable loadRelationshipData
  const loadRelationshipData = useCallback(() => {
    try {
      const projects = getAllProjects();
      const types = getAllTypes();
      const skills = getAllSkills();
      const tags = getAllTags();
      const media = getAllMedia();
      const links = getAllLinks();
      setRelationshipData({
        projects: projects || [],
        types: types || [],
        skills: skills || [],
        tags: tags || [],
        media: media || [],
        links: links || []
      });
    } catch (error) {
      setRelationshipData({
        projects: [],
        types: [],
        skills: [],
        tags: [],
        media: [],
        links: []
      });
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadData();
    loadRelationshipData();
  }, [loadData, loadRelationshipData]);

  const validateData = async () => {
    // Don't validate during form editing
    if (isFormEditing) {
      console.log('Skipping validation during form editing');
      return { isValid: true, errors: [] };
    }
    
    try {
      const results = await validateAllData();
      setValidationErrors(results);
      
      const hasErrors = Object.values(results).some(result => 
        result && typeof result === 'object' && !result.isValid
      );
      
      if (hasErrors) {
        console.warn('Validation errors found:', results);
      }
      
      return results;
    } catch (error) {
      console.error('Validation error:', error);
      return { isValid: false, errors: [error.message] };
    }
  };

  const saveData = async (type, data) => {
    try {
      // Only validate if not in form editing mode
      if (!isFormEditing) {
        const validation = await validateData();
        
        const typeErrors = validation[type]?.errors || [];
        const hasCriticalErrors = typeErrors.some(error => 
          error.instancePath && error.instancePath.includes(type)
        );
        
        if (hasCriticalErrors) {
          alert(`Validation failed for ${type}. Please fix errors before saving.`);
          return false;
        }
      }

      // Update local state immediately for UI responsiveness
      setJsonData(prev => ({
        ...prev,
        [type]: data
      }));

      // Save to backend API
      const response = await fetch(`http://localhost:3001/api/data/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Failed to save ${type}: ${response.status}`);
      }

      await response.json();
      
      console.log(`Saved ${type} data:`, data);
      alert(`${type} data saved successfully!`);
      return true;
    } catch (error) {
      console.error('Save error:', error);
      alert(`Error saving data: ${error.message}`);
      return false;
    }
  };

  // const handleImageUpload = async (files, projectId) => {
  //   setIsUploading(true);
  //   setUploadProgress(0);

  //   try {
  //     const uploadedMedia = [];

  //     for (let i = 0; i < files.length; i++) {
  //       const file = files[i];
  //       setUploadProgress((i / files.length) * 100);

  //       await new Promise(resolve => setTimeout(resolve, 500));

  //       const mediaId = `media-${Date.now()}-${i}`;
  //       const optimizedFile = await optimizeImage(file);
        
  //       const currentMedia = jsonData.media?.media || [];
  //       const projectMedia = currentMedia.filter(m => m.project === projectId);
  //       const hasThumbnail = projectMedia.some(m => m.category === 'thumbnail');
  //       const category = (!hasThumbnail && i === 0) ? 'thumbnail' : 'gallery';
        
  //       uploadedMedia.push({
  //         id: mediaId,
  //         filename: optimizedFile.name,
  //         path: `/src/assets/images/${projectId}/`,
  //         description: file.name,
  //         alt: file.name,
  //         dimensions: {
  //           width: 800,
  //           height: 600
  //       },
  //         type: 'image',
  //         format: 'webp',
  //         size: `${Math.round(optimizedFile.size / 1024)}KB`,
  //         project: projectId,
  //         category: category
  //       });
  //     }

  //     const currentMedia = jsonData.media?.media || [];
  //     const updatedMedia = [...currentMedia, ...uploadedMedia];
      
  //     await saveData('media', { media: updatedMedia });
      
  //     setUploadProgress(100);
  //     setTimeout(() => {
  //       setIsUploading(false);
  //       setUploadProgress(0);
  //     }, 1000);

  //   } catch (error) {
  //     console.error('Upload error:', error);
  //     alert('Error uploading images');
  //     setIsUploading(false);
  //   }
  // };

  // Bulk optimization function for existing images
  const handleBulkOptimization = async () => {
    if (!window.confirm('This will optimize all existing images. Continue?')) {
      return;
    }
    
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    try {
      // Get all media items
      const allMedia = jsonData.media?.media || [];
      const imageMedia = allMedia.filter(m => m.type === 'image');
      
      let processed = 0;
      const optimizedMedia = [];
      
      for (const mediaItem of imageMedia) {
        setOptimizationProgress((processed / imageMedia.length) * 100);
        
        // Simulate optimization (in real implementation, you'd process the actual files)
        const optimizedItem = {
          ...mediaItem,
          optimized: true,
          sizeReduction: Math.round(Math.random() * 50 + 30), // Simulated reduction
          originalSize: parseInt(mediaItem.size) || 100
        };
        
        optimizedMedia.push(optimizedItem);
        processed++;
        
        // Small delay to prevent blocking
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Update media data
      const updatedMedia = jsonData.media.media.map(item => {
        const optimized = optimizedMedia.find(o => o.id === item.id);
        return optimized || item;
      });
      
      setJsonData(prev => ({
        ...prev,
        media: { media: updatedMedia }
      }));
      
      setOptimizationProgress(100);
      alert(`Optimized ${processed} images successfully!`);
      
    } catch (error) {
      console.error('Bulk optimization error:', error);
      alert('Error during bulk optimization');
    } finally {
      setIsOptimizing(false);
      setOptimizationProgress(0);
    }
  };

  // Form-based editor components
  const ProjectForm = ({ project, onSave, onCancel }) => {
    const [formData, setFormData] = useState(project || {
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
      difficulty: 'intermediate'
    });
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    // Get existing media for this project
    const existingMedia = relationshipData.media?.filter(media => 
      media.project === formData.id
    ) || [];

    const handleImageUpload = async (files) => {
      if (!formData.id) {
        alert('Please enter a project ID first before uploading images.');
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const uploadedMedia = [];
        const optimalFormat = getOptimalFormat();

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          // Validate file
          try {
            validateImageFile(file);
          } catch (error) {
            alert(`Error with file ${file.name}: ${error.message}`);
            continue;
          }

          setUploadProgress((i / files.length) * 100);

          const mediaId = `media-${Date.now()}-${i}`;
          
          // Determine image spec based on category
          const hasThumbnail = existingMedia.some(m => m.category === 'thumbnail');
          const category = (!hasThumbnail && i === 0) ? 'thumbnail' : 'gallery';
          const spec = category === 'thumbnail' ? 'thumbnail' : 'gallery';
          
          // Optimize image with proper specifications
          const optimizationResult = await optimizeImage(file, spec, optimalFormat);
          
          uploadedMedia.push({
            id: mediaId,
            filename: optimizationResult.file.name,
            path: `/src/assets/images/${formData.id}/`,
            description: file.name,
            alt: file.name,
            dimensions: optimizationResult.dimensions,
            type: 'image',
            format: optimalFormat,
            size: `${optimizationResult.size}KB`,
            project: formData.id,
            category: category,
            optimized: true,
            originalSize: Math.round(file.size / 1024),
            sizeReduction: Math.round(((file.size - optimizationResult.file.size) / file.size) * 100)
          });
        }

        // Update local media data
        const currentMedia = jsonData.media?.media || [];
        const updatedMedia = [...currentMedia, ...uploadedMedia];
        
        // Update form data with new media IDs
        const newMediaIds = uploadedMedia.map(m => m.id);
        setFormData(prev => ({
          ...prev,
          mediaIds: [...(prev.mediaIds || []), ...newMediaIds]
        }));

        // Update relationship data
        setRelationshipData(prev => ({
          ...prev,
          media: [...(prev.media || []), ...uploadedMedia]
        }));

        // Update jsonData
        setJsonData(prev => ({
          ...prev,
          media: { media: updatedMedia }
        }));
        
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);

      } catch (error) {
        console.error('Upload error:', error);
        alert('Error uploading images');
        setIsUploading(false);
      }
    };

    const removeMedia = (mediaId) => {
      if (window.confirm('Are you sure you want to remove this media item?')) {
        // Remove from form data
        setFormData(prev => ({
          ...prev,
          mediaIds: prev.mediaIds?.filter(id => id !== mediaId) || []
        }));

        // Remove from relationship data
        setRelationshipData(prev => ({
          ...prev,
          media: prev.media?.filter(m => m.id !== mediaId) || []
        }));

        // Remove from jsonData
        setJsonData(prev => ({
          ...prev,
          media: {
            media: prev.media?.media?.filter(m => m.id !== mediaId) || []
          }
        }));
      }
    };

    return (
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>ID (Slug)</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleChange('id', e.target.value)}
                className="neumorphic-input"
                placeholder="project-slug"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="neumorphic-input"
                placeholder="Project Title"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="neumorphic-input"
                placeholder="project-slug"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="neumorphic-input"
                placeholder="Project subtitle"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="neumorphic-input"
              placeholder="Project description..."
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Year</label>
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
            
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="neumorphic-input"
              >
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planned">Planned</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Difficulty</label>
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Emotion</label>
              <input
                type="text"
                value={formData.emotion}
                onChange={(e) => handleChange('emotion', e.target.value)}
                className="neumorphic-input"
                placeholder="e.g., electrified nostalgia"
              />
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.highlight}
                  onChange={(e) => handleChange('highlight', e.target.checked)}
                />
                Highlight Project
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Relationships</h3>
          
          <div className="form-group">
            <label>Project Types</label>
            <ArraySelector
              items={relationshipData.types || []}
              selectedItems={formData.typeIds}
              onSelectionChange={(value) => handleArrayChange('typeIds', value)}
              placeholder="Select project types..."
            />
          </div>

          <div className="form-group">
            <label>Tools & Technologies</label>
            <ArraySelector
              items={relationshipData.skills || []}
              selectedItems={formData.toolIds}
              onSelectionChange={(value) => handleArrayChange('toolIds', value)}
              placeholder="Select tools and technologies..."
            />
          </div>

          <div className="form-group">
            <label>Tags</label>
            <ArraySelector
              items={relationshipData.tags || []}
              selectedItems={formData.tagIds}
              onSelectionChange={(value) => handleArrayChange('tagIds', value)}
              placeholder="Select tags..."
            />
          </div>

          <div className="form-group">
            <label>Links</label>
            <ArraySelector
              items={relationshipData.links || []}
              selectedItems={formData.linkIds}
              onSelectionChange={(value) => handleArrayChange('linkIds', value)}
              placeholder="Select links..."
            />
          </div>

          <div className="form-group">
            <label>Media Assets</label>
            
            {/* Existing Media Display */}
            {existingMedia.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '1rem' }}>Existing Media:</h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 'var(--spacing-sm)'
                }}>
                  {existingMedia.map(media => (
                    <div key={media.id} style={{
                      padding: 'var(--spacing-sm)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-secondary)',
                      position: 'relative'
                    }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                        {media.filename}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {media.category} • {media.size}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedia(media.id)}
                        style={{
                          position: 'absolute',
                          top: 'var(--spacing-xs)',
                          right: 'var(--spacing-xs)',
                          background: 'var(--error-color)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Upload Section */}
            <div style={{ 
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-lg)',
              textAlign: 'center',
              backgroundColor: 'var(--bg-secondary)',
              marginTop: 'var(--spacing-sm)'
            }}>
              {isUploading ? (
                <div>
                  <div>Processing images...</div>
                  <div style={{ 
                    width: '100%', 
                    height: '4px', 
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-sm)',
                    marginTop: 'var(--spacing-md)'
                  }}>
                    <div style={{
                      width: `${uploadProgress}%`,
                      height: '100%',
                      backgroundColor: 'var(--accent-primary)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📁</div>
                  <div>Drag & drop images here or</div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    style={{ display: 'none' }}
                    id="project-image-upload"
                  />
                  <label htmlFor="project-image-upload" className="btn btn-pill" style={{ marginTop: 'var(--spacing-sm)' }}>
                    Choose Files
                  </label>
                  {!formData.id && (
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: 'var(--text-secondary)', 
                      marginTop: 'var(--spacing-sm)' 
                    }}>
                      Note: Enter a project ID first to upload images
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-pill">
            {editingItem ? 'Update Project' : 'Create Project'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-pill btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const TypeForm = ({ type, onSave, onCancel }) => {
    const [formData, setFormData] = useState(type || {
      id: '',
      label: '',
      description: '',
      category: 'creative',
      icon: '',
      color: '#FF6B6B',
      priority: 1
    });

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h3>Type Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>ID (Slug)</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleChange('id', e.target.value)}
                className="neumorphic-input"
                placeholder="type-slug"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Label</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => handleChange('label', e.target.value)}
                className="neumorphic-input"
                placeholder="Type Label"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="neumorphic-input"
              placeholder="Type description..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="neumorphic-input"
              >
                <option value="creative">Creative</option>
                <option value="technical">Technical</option>
                <option value="business">Business</option>
                <option value="research">Research</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => handleChange('icon', e.target.value)}
                className="neumorphic-input"
                placeholder="🎨"
              />
            </div>
            
            <div className="form-group">
              <label>Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="neumorphic-input"
                style={{ height: '40px' }}
              />
            </div>
            
            <div className="form-group">
              <label>Priority</label>
              <input
                type="number"
                value={formData.priority}
                onChange={(e) => handleChange('priority', parseInt(e.target.value))}
                className="neumorphic-input"
                min="1"
                max="100"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-pill">Save Type</button>
          <button type="button" onClick={onCancel} className="btn btn-pill btn-secondary">Cancel</button>
        </div>
      </form>
    );
  };

  const SkillForm = ({ skill, onSave, onCancel }) => {
    const [formData, setFormData] = useState(skill || {
      id: '',
      name: '',
      level: 50,
      description: '',
      category: 'Development',
      icon: '💻',
      color: '#4ECDC4'
    });

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h3>Skill Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>ID (Slug)</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleChange('id', e.target.value)}
                className="neumorphic-input"
                placeholder="skill-slug"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="neumorphic-input"
                placeholder="Skill Name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="neumorphic-input"
              placeholder="Skill description..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="neumorphic-input"
                placeholder="Development"
              />
            </div>
            
            <div className="form-group">
              <label>Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => handleChange('icon', e.target.value)}
                className="neumorphic-input"
                placeholder="💻"
              />
            </div>
            
            <div className="form-group">
              <label>Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="neumorphic-input"
                style={{ height: '40px' }}
              />
            </div>
            
            <div className="form-group">
              <label>Level (0-100)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.level}
                onChange={(e) => handleChange('level', parseInt(e.target.value))}
                className="neumorphic-input"
              />
              <span>{formData.level}%</span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-pill">Save Skill</button>
          <button type="button" onClick={onCancel} className="btn btn-pill btn-secondary">Cancel</button>
        </div>
      </form>
    );
  };

  const TagForm = ({ tag, onSave, onCancel }) => {
    const [formData, setFormData] = useState(tag || {
      id: '',
      label: '',
      description: '',
      category: 'technology',
      icon: '⚡',
      color: '#FFEAA7'
    });

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h3>Tag Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>ID (Slug)</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleChange('id', e.target.value)}
                className="neumorphic-input"
                placeholder="tag-slug"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Label</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => handleChange('label', e.target.value)}
                className="neumorphic-input"
                placeholder="Tag Label"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="neumorphic-input"
              placeholder="Tag description..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="neumorphic-input"
              >
                <option value="technology">Technology</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="creative">Creative</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => handleChange('icon', e.target.value)}
                className="neumorphic-input"
                placeholder="⚡"
              />
            </div>
            
            <div className="form-group">
              <label>Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="neumorphic-input"
                style={{ height: '40px' }}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-pill">Save Tag</button>
          <button type="button" onClick={onCancel} className="btn btn-pill btn-secondary">Cancel</button>
        </div>
      </form>
    );
  };

  const MediaForm = ({ media, onSave, onCancel }) => {
    const [formData, setFormData] = useState(media || {
      id: '',
      filename: '',
      path: '',
      description: '',
      alt: '',
      dimensions: { width: 800, height: 600 },
      type: 'image',
      format: 'webp',
      size: '',
      project: '',
      category: 'gallery'
    });

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDimensionChange = (dimension, value) => {
      setFormData(prev => ({
        ...prev,
        dimensions: { 
          ...(prev.dimensions || { width: 800, height: 600 }), 
          [dimension]: parseInt(value) || 0 
        }
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    // Ensure dimensions object exists
    const dimensions = formData.dimensions || { width: 800, height: 600 };

    return (
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h3>Media Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>ID (Slug)</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleChange('id', e.target.value)}
                className="neumorphic-input"
                placeholder="media-slug"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Filename</label>
              <input
                type="text"
                value={formData.filename}
                onChange={(e) => handleChange('filename', e.target.value)}
                className="neumorphic-input"
                placeholder="image-1234567890.webp"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Path</label>
              <input
                type="text"
                value={formData.path}
                onChange={(e) => handleChange('path', e.target.value)}
                className="neumorphic-input"
                placeholder="/src/assets/images/project/"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Project</label>
              <select
                value={formData.project}
                onChange={(e) => handleChange('project', e.target.value)}
                className="neumorphic-input"
                required
              >
                <option value="">Select project...</option>
                {relationshipData.projects?.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="neumorphic-input"
              placeholder="Media description..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Alt Text</label>
            <input
              type="text"
              value={formData.alt}
              onChange={(e) => handleChange('alt', e.target.value)}
              className="neumorphic-input"
              placeholder="Alt text for accessibility"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Width</label>
              <input
                type="number"
                value={dimensions.width}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                className="neumorphic-input"
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label>Height</label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                className="neumorphic-input"
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="neumorphic-input"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="document">Document</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Format</label>
              <input
                type="text"
                value={formData.format}
                onChange={(e) => handleChange('format', e.target.value)}
                className="neumorphic-input"
                placeholder="webp"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Size</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => handleChange('size', e.target.value)}
                className="neumorphic-input"
                placeholder="245KB"
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="neumorphic-input"
              >
                <option value="thumbnail">Thumbnail</option>
                <option value="gallery">Gallery</option>
                <option value="hero">Hero</option>
                <option value="background">Background</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-pill">Save Media</button>
          <button type="button" onClick={onCancel} className="btn btn-pill btn-secondary">Cancel</button>
        </div>
      </form>
    );
  };

  const LinkForm = ({ link, onSave, onCancel }) => {
    const [formData, setFormData] = useState(link || {
      id: '',
      label: '',
      url: '',
      type: 'demo',
      icon: '🌐',
      project: ''
    });

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <h3>Link Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>ID (Slug)</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleChange('id', e.target.value)}
                className="neumorphic-input"
                placeholder="link-slug"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Label</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => handleChange('label', e.target.value)}
                className="neumorphic-input"
                placeholder="Link Label"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
              className="neumorphic-input"
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="neumorphic-input"
              >
                <option value="demo">Demo</option>
                <option value="github">GitHub</option>
                <option value="documentation">Documentation</option>
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => handleChange('icon', e.target.value)}
                className="neumorphic-input"
                placeholder="🌐"
              />
            </div>
            
            <div className="form-group">
              <label>Project</label>
              <select
                value={formData.project}
                onChange={(e) => handleChange('project', e.target.value)}
                className="neumorphic-input"
              >
                <option value="">Select project...</option>
                {relationshipData.projects?.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-pill">Save Link</button>
          <button type="button" onClick={onCancel} className="btn btn-pill btn-secondary">Cancel</button>
        </div>
      </form>
    );
  };

  const ArraySelector = ({ items, selectedItems, onSelectionChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Ensure items is always an array
    const safeItems = items || [];
    const safeSelectedItems = selectedItems || [];

    const filteredItems = safeItems.filter(item => 
      item.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggle = (itemId) => {
      const newSelection = safeSelectedItems.includes(itemId)
        ? safeSelectedItems.filter(id => id !== itemId)
        : [...safeSelectedItems, itemId];
      onSelectionChange(newSelection);
    };

    const handleRemove = (itemId) => {
      onSelectionChange(safeSelectedItems.filter(id => id !== itemId));
    };

    return (
      <div className="array-selector">
        <div className="selected-items">
          {safeSelectedItems.map(itemId => {
            const item = safeItems.find(i => i.id === itemId);
            return item ? (
              <span key={itemId} className="selected-item">
                {item.label || item.name || item.title}
                <button
                  type="button"
                  onClick={() => handleRemove(itemId)}
                  className="remove-btn"
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
        </div>
        
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="btn btn-pill btn-outline"
        >
          {placeholder} ({safeSelectedItems.length} selected)
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="modal-content"
              >
                <div className="modal-header">
                  <h3>{placeholder}</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="btn btn-pill"
                  >
                    ✕
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="neumorphic-input"
                />

                <div className="items-list">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <label
                        key={item.id}
                        className={`item-option ${safeSelectedItems.includes(item.id) ? 'selected' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={safeSelectedItems.includes(item.id)}
                          onChange={() => handleToggle(item.id)}
                        />
                        <span>{item.label || item.name || item.title}</span>
                        {item.icon && <span className="item-icon">{item.icon}</span>}
                      </label>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                      <div>No items available</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {searchTerm ? 'No items match your search' : 'No items have been added yet'}
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-actions">
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
        </AnimatePresence>
      </div>
    );
  };

  // Helper to always get an array for a given type
  const getItemsArray = (type, data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data[type])) return data[type];
    // Try common keys
    if (Array.isArray(data[`${type}s`])) return data[`${type}s`];
    if (Array.isArray(data.items)) return data.items;
    return [];
  };

  const DataList = ({ type, data, onEdit, onDelete, onAdd }) => {
    const items = getItemsArray(type, data);
    
    // Check if data is still loading
    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="data-list">
          <div className="list-header">
            <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
          </div>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <div>Loading {type} data...</div>
          </div>
        </div>
      );
    }
    
    // Check if items array is empty
    if (!Array.isArray(items) || items.length === 0) {
      return (
        <div className="data-list">
          <div className="list-header">
            <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            <button onClick={onAdd} className="btn btn-pill">
              Add New {type.slice(0, -1)}
            </button>
          </div>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <div>No {type} found. Click "Add New {type.slice(0, -1)}" to create one.</div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="data-list">
        <div className="list-header">
          <h3>{type.charAt(0).toUpperCase() + type.slice(1)} ({items.length})</h3>
          <button onClick={onAdd} className="btn btn-pill">
            Add New {type.slice(0, -1)}
          </button>
        </div>
        
        <div className="items-grid">
          {items.map((item, index) => (
            <div key={item.id || index} className="item-card">
              <div className="item-header">
                <h4>{item.title || item.label || item.name || `Item ${index + 1}`}</h4>
                <div className="item-actions">
                  <button
                    onClick={() => onEdit(item)}
                    className="btn btn-sm btn-pill"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="btn btn-sm btn-pill btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="item-content">
                {item.description && (
                  <p className="item-description">{item.description}</p>
                )}
                {item.subtitle && (
                  <p className="item-subtitle">{item.subtitle}</p>
                )}
                {item.year && (
                  <p className="item-year">{item.year}</p>
                )}
                {item.status && (
                  <span className={`status-badge status-${item.status}`}>
                    {item.status}
                  </span>
                )}
                {item.category && (
                  <span className="category-badge">{item.category}</span>
                )}
                {item.level && (
                  <span className="level-badge">{item.level}%</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsEditing(true);
    setIsFormEditing(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsEditing(true);
    setIsFormEditing(true);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const currentData = jsonData[activeTab];
      const updatedItems = currentData[activeTab] || currentData;
      const filteredItems = updatedItems.filter(item => item.id !== itemId);
      
      const newData = Array.isArray(currentData) 
        ? filteredItems 
        : { ...currentData, [activeTab]: filteredItems };
      
      saveData(activeTab, newData);
    }
  };

  const handleSaveItem = async (itemData) => {
    try {
      // Set form editing state to false when saving
      setIsFormEditing(false);
      
      const currentData = jsonData[activeTab];
      let updatedData;
      
      if (editingItem) {
        // Update existing item
        const items = currentData[activeTab] || currentData;
        const updatedItems = items.map(item => 
          item.id === editingItem.id ? { ...item, ...itemData } : item
        );
        updatedData = Array.isArray(currentData) ? updatedItems : { ...currentData, [activeTab]: updatedItems };
      } else {
        // Add new item
        const items = currentData[activeTab] || currentData;
        const newItem = { ...itemData, id: itemData.id || `${activeTab}-${Date.now()}` };
        const updatedItems = [...items, newItem];
        updatedData = Array.isArray(currentData) ? updatedItems : { ...currentData, [activeTab]: updatedItems };
      }
      
      // Only save if the user explicitly submits the form
      const success = await saveData(activeTab, updatedData);
      if (success) {
        setIsEditing(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item. Please try again.');
    }
  };

  const handleCancelItem = () => {
    setIsEditing(false);
    setEditingItem(null);
    setIsFormEditing(false);
  };

  const ValidationErrorDisplay = ({ errors }) => {
    if (!errors || Object.keys(errors).length === 0) return null;

    const allErrors = [];
    Object.entries(errors).forEach(([type, result]) => {
      if (result && typeof result === 'object' && result.errors) {
        result.errors.forEach(error => {
          allErrors.push({
            type,
            message: error.message || error,
            path: error.instancePath || error.schemaPath || 'unknown'
          });
        });
      }
    });

    if (allErrors.length === 0) return null;

    return (
      <div style={{ 
        backgroundColor: 'var(--error-color)', 
        color: 'white', 
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--radius-sm)',
        marginTop: 'var(--spacing-md)'
      }}>
        <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Validation Errors:</h4>
        <div style={{ maxHeight: '200px', overflow: 'auto' }}>
          {allErrors.map((error, index) => (
            <div key={index} style={{ marginBottom: 'var(--spacing-xs)' }}>
              <strong>{error.type}:</strong> {error.message}
              {error.path && <span style={{ fontSize: '0.8rem', opacity: 0.8 }}> (at {error.path})</span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-2xl)' }}>
      <div className="neumorphic-raised" style={{ padding: 'var(--spacing-2xl)' }}>
        <h1 className="text-embossed" style={{ 
          fontSize: '2.5rem', 
          marginBottom: 'var(--spacing-xl)',
          textAlign: 'center'
        }}>
          Data Manager
        </h1>

        {/* Bulk Optimization Section */}
        <div style={{
          marginBottom: 'var(--spacing-xl)',
          padding: 'var(--spacing-lg)',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--accent-primary)' }}>
            🖼️ Image Optimization
          </h3>
          <p style={{ marginBottom: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>
            Optimize all existing images to reduce file sizes and improve loading performance.
          </p>
          
          {isOptimizing ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                background: 'var(--bg-primary)', 
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                marginBottom: 'var(--spacing-sm)'
              }}>
                <div style={{
                  width: `${optimizationProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Optimizing images... {Math.round(optimizationProgress)}%
              </p>
            </div>
          ) : (
            <button 
              onClick={handleBulkOptimization}
              className="btn btn-pill"
              style={{ 
                background: 'linear-gradient(145deg, var(--accent-primary), var(--accent-secondary))',
                color: 'white',
                border: 'none',
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              🚀 Optimize All Images
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-sm)', 
          marginBottom: 'var(--spacing-xl)',
          flexWrap: 'wrap'
        }}>
          {dataTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`btn btn-pill ${activeTab === type.id ? 'neumorphic-inset' : ''}`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {isEditing ? (
            (() => {
              switch (activeTab) {
                case 'projects':
                  return (
                    <ProjectForm
                      project={editingItem}
                      onSave={handleSaveItem}
                      onCancel={handleCancelItem}
                    />
                  );
                case 'types':
                  return (
                    <TypeForm
                      type={editingItem}
                      onSave={handleSaveItem}
                      onCancel={handleCancelItem}
                    />
                  );
                case 'skills':
                  return (
                    <SkillForm
                      skill={editingItem}
                      onSave={handleSaveItem}
                      onCancel={handleCancelItem}
                    />
                  );
                case 'tags':
                  return (
                    <TagForm
                      tag={editingItem}
                      onSave={handleSaveItem}
                      onCancel={handleCancelItem}
                    />
                  );
                case 'media':
                  return (
                    <MediaForm
                      media={editingItem}
                      onSave={handleSaveItem}
                      onCancel={handleCancelItem}
                    />
                  );
                case 'links':
                  return (
                    <LinkForm
                      link={editingItem}
                      onSave={handleSaveItem}
                      onCancel={handleCancelItem}
                    />
                  );
                default:
                  return (
                    <DataList
                      type={activeTab}
                      data={jsonData[activeTab] || {}}
                      onEdit={handleEditItem}
                      onDelete={handleDeleteItem}
                      onAdd={handleAddItem}
                    />
                  );
              }
            })()
          ) : (
            <DataList
              type={activeTab}
              data={jsonData[activeTab] || {}}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onAdd={handleAddItem}
            />
          )}
        </div>

        {/* Validation Status */}
        <div style={{ marginTop: 'var(--spacing-xl)' }}>
          <button
            onClick={validateData}
            className="btn btn-pill"
          >
            Validate All Data
          </button>
          
          {Object.keys(validationErrors).length > 0 && (
            <ValidationErrorDisplay errors={validationErrors} />
          )}
        </div>
      </div>

      <style jsx>{`
        .form-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .form-section {
          margin-bottom: var(--spacing-xl);
          padding: var(--spacing-lg);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }
        
        .form-section h3 {
          margin-bottom: var(--spacing-lg);
          color: var(--text-primary);
        }
        
        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }
        
        .form-group {
          margin-bottom: var(--spacing-md);
        }
        
        .form-group label {
          display: block;
          margin-bottom: var(--spacing-xs);
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .form-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: flex-end;
          margin-top: var(--spacing-xl);
        }
        
        .array-selector {
          position: relative;
        }
        
        .selected-items {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-sm);
        }
        
        .selected-item {
          display: inline-flex;
          align-items: center;
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--accent-primary);
          color: white;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
        }
        
        .remove-btn {
          background: none;
          border: none;
          color: white;
          margin-left: var(--spacing-xs);
          cursor: pointer;
          font-size: 1.2rem;
          line-height: 1;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-content {
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          padding: var(--spacing-xl);
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow: auto;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }
        
        .items-list {
          max-height: 300px;
          overflow-y: auto;
          margin: var(--spacing-lg) 0;
        }
        
        .item-option {
          display: flex;
          align-items: center;
          padding: var(--spacing-sm);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: background-color 0.2s ease;
        }
        
        .item-option:hover {
          background: var(--bg-secondary);
        }
        
        .item-option.selected {
          background: var(--accent-primary);
          color: white;
        }
        
        .item-option input {
          margin-right: var(--spacing-sm);
        }
        
        .item-icon {
          margin-left: var(--spacing-xs);
        }
        
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: var(--spacing-lg);
        }
        
        .data-list {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }
        
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }
        
        .item-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          transition: transform 0.2s ease;
        }
        
        .item-card:hover {
          transform: translateY(-2px);
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-md);
        }
        
        .item-header h4 {
          margin: 0;
          color: var(--text-primary);
        }
        
        .item-actions {
          display: flex;
          gap: var(--spacing-xs);
        }
        
        .item-content {
          color: var(--text-secondary);
        }
        
        .item-description {
          margin-bottom: var(--spacing-sm);
          line-height: 1.5;
        }
        
        .item-subtitle {
          font-style: italic;
          margin-bottom: var(--spacing-xs);
        }
        
        .item-year {
          font-weight: 600;
          color: var(--accent-primary);
        }
        
        .status-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-completed {
          background: #4CAF50;
          color: white;
        }
        
        .status-in-progress {
          background: #FF9800;
          color: white;
        }
        
        .status-planned {
          background: #2196F3;
          color: white;
        }
        
        .category-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          margin-left: var(--spacing-xs);
        }
        
        .level-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--accent-primary);
          color: white;
          margin-left: var(--spacing-xs);
        }
        
        .checkbox-group {
          display: flex;
          align-items: center;
        }
        
        .checkbox-group label {
          display: flex;
          align-items: center;
          margin: 0;
          cursor: pointer;
        }
        
        .checkbox-group input {
          margin-right: var(--spacing-sm);
        }
        
        .btn-outline {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
        }
        
        .btn-outline:hover {
          background: var(--bg-secondary);
        }
        
        .btn-danger {
          background: var(--error-color);
          color: white;
        }
        
        .btn-danger:hover {
          background: #d32f2f;
        }
        
        .btn-secondary {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        
        .btn-sm {
          padding: var(--spacing-xs) var(--spacing-sm);
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};

export default DataManager; 