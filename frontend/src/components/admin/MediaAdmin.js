import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSync, FaImage, FaFolder, FaUpload, FaDownload, FaFilter } from 'react-icons/fa';

const MediaAdmin = () => {
  const [media, setMedia] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMedia, setEditingMedia] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [filterValue, setFilterValue] = useState('all');
  const [uploadProject, setUploadProject] = useState('');
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  
  const [formData, setFormData] = useState({
    id: '',
    filename: '',
    path: '',
    description: '',
    alt: '',
    dimensions: { width: 0, height: 0 },
    type: 'image',
    format: 'jpg',
    size: '',
    project: '',
    category: 'thumbnail',
    tags: [],
    metadata: {
      created: '',
      modified: '',
      author: '',
      license: ''
    }
  });

  // Load media and projects data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      const [mediaRes, projectsRes] = await Promise.all([
        fetch('http://localhost:3001/api/data/media'),
        fetch('http://localhost:3001/api/data/projects')
      ]);

      if (mediaRes.ok) {
        const data = await mediaRes.json();
        setMedia(data.media || []);
      }

      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data.projects || []);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMedia = async (updatedMedia) => {
    try {
      const response = await fetch('http://localhost:3001/api/data/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ media: updatedMedia })
      });

      if (response.ok) {
        setMedia(updatedMedia);
        return true;
      } else {
        console.error('Save failed:', response.status);
      }
    } catch (error) {
      console.error('Error saving media:', error);
    }
    return false;
  };

  // Filter media based on selected filter
  const getFilteredMedia = () => {
    switch (filterValue) {
      case 'all':
        return media;
      case 'unassigned':
        return media.filter(item => !item.project || item.project === '');
      default:
        // Filter by specific project
        return media.filter(item => item.project === filterValue);
    }
  };

  const handleAddMedia = () => {
    setIsUploadOpen(true);
  };

  const handleEditMedia = (mediaItem) => {
    setFormData({ ...mediaItem });
    setEditingMedia(mediaItem);
    setIsFormOpen(true);
  };

  const handleDeleteMedia = async (mediaId) => {
    if (window.confirm('Are you sure you want to delete this media item? This will also delete the file from the server.')) {
      try {
        // First delete the file from server
        const deleteResponse = await fetch(`http://localhost:3001/api/media/${mediaId}`, {
          method: 'DELETE'
        });

        if (deleteResponse.ok) {
          // Then remove from JSON
          const updatedMedia = media.filter(m => m.id !== mediaId);
          const success = await saveMedia(updatedMedia);
          if (success) {
            await loadAllData();
            alert('Media deleted successfully');
          }
        } else {
          alert('Failed to delete file from server');
        }
      } catch (error) {
        console.error('Error deleting media:', error);
        alert('Error deleting media');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const updatedMedia = { ...formData };

    // If project changed, we need to move the file
    if (editingMedia && editingMedia.project !== updatedMedia.project) {
      try {
        const moveResponse = await fetch(`http://localhost:3001/api/media/${updatedMedia.id}/move`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            oldProject: editingMedia.project,
            newProject: updatedMedia.project 
          })
        });

        if (!moveResponse.ok) {
          alert('Failed to move file to new project folder');
          return;
        }
      } catch (error) {
        console.error('Error moving file:', error);
        alert('Error moving file');
        return;
      }
    }

    let updatedMediaList;
    if (editingMedia) {
      // Update existing media
      updatedMediaList = media.map(m => 
        m.id === editingMedia.id ? updatedMedia : m
      );
    } else {
      // Add new media
      updatedMediaList = [...media, updatedMedia];
    }

    const success = await saveMedia(updatedMediaList);
    if (success) {
      await loadAllData();
      setIsFormOpen(false);
      setEditingMedia(null);
      setFormData({
        id: '',
        filename: '',
        path: '',
        description: '',
        alt: '',
        dimensions: { width: 0, height: 0 },
        type: 'image',
        format: 'jpg',
        size: '',
        project: '',
        category: 'thumbnail',
        tags: [],
        metadata: {
          created: '',
          modified: '',
          author: '',
          license: ''
        }
      });
      alert('Media saved successfully');
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    handleFormChange(field, array);
  };

  // File upload handlers
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedMedia = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('optimize', 'true');
        formData.append('format', 'webp');
        formData.append('project', uploadProject || ''); // Append project ID

        const response = await fetch('http://localhost:3001/api/media/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          
          // Create media item with extracted metadata
          const mediaItem = {
            id: `media-${Date.now()}-${i}`,
            filename: file.name,
            path: result.path,
            description: file.name,
            alt: file.name,
            dimensions: result.dimensions || { width: 0, height: 0 },
            type: 'image',
            format: result.format || 'webp',
            size: result.size || `${Math.round(file.size / 1024)}KB`,
            project: uploadProject || '', // Assign project from upload modal
            category: 'gallery',
            tags: [],
            metadata: {
              created: new Date().toISOString(),
              modified: new Date().toISOString(),
              author: '',
              license: ''
            }
          };
          
          uploadedMedia.push(mediaItem);
        }

        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      if (uploadedMedia.length > 0) {
        const updatedMedia = [...media, ...uploadedMedia];
        const success = await saveMedia(updatedMedia);
        if (success) {
          await loadAllData();
          setIsUploadOpen(false);
          setSelectedFiles([]);
          setUploadProject('');
          alert(`${uploadedMedia.length} images uploaded and optimized successfully`);
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.title : 'Unassigned';
  };

  const getFileSize = (size) => {
    if (!size) return '';
    const num = parseInt(size);
    if (num < 1024) return `${num}B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)}KB`;
    return `${(num / (1024 * 1024)).toFixed(1)}MB`;
  };

  const filteredMedia = getFilteredMedia();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Image Management</h2>
          <p className="text-gray-600 mt-1">Manage and organize your image assets</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FaSync className="text-sm" />
            Refresh
          </button>
          <button
            onClick={handleAddMedia}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="text-sm" />
            Add Images
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <label className="text-sm font-medium text-gray-700">Filter by:</label>
          </div>
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Images ({media.length})</option>
            <option value="unassigned">Unassigned ({media.filter(item => !item.project || item.project === '').length})</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title || 'Untitled Project'} ({media.filter(item => item.project === project.id).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Image Preview */}
            <div className="aspect-square bg-gray-100 relative group">
              {item.path ? (
                <img
                  src={item.path}
                  alt={item.alt || item.description}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="hidden group-hover:flex absolute inset-0 bg-black bg-opacity-50 items-center justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditMedia(item)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteMedia(item.id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="hidden items-center justify-center w-full h-full">
                <FaImage className="text-4xl text-gray-400" />
              </div>
            </div>

            {/* Image Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 truncate flex-1">
                  {item.filename || 'Untitled'}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.category === 'thumbnail' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.category}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {item.description || 'No description'}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{item.format?.toUpperCase()}</span>
                <span>{getFileSize(item.size)}</span>
                <span>{item.dimensions?.width}×{item.dimensions?.height}</span>
              </div>

              {item.project && (
                <div className="mt-2">
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {getProjectName(item.project)}
                  </span>
                </div>
              )}

              {item.tags?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {filteredMedia.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <FaImage className="text-6xl mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">
              {filterValue === 'all' 
                ? 'No images found' 
                : filterValue === 'unassigned'
                ? 'No unassigned images'
                : `No images in ${projects.find(p => p.id === filterValue)?.title || 'this project'}`
              }
            </p>
            <p className="text-sm">
              {filterValue === 'all' 
                ? 'Upload some images to get started' 
                : 'Try changing the filter or upload new images'
              }
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Upload Images</h3>
                <button
                  onClick={() => {
                    setIsUploadOpen(false);
                    setSelectedFiles([]);
                    setUploadProject('');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Drag & Drop Zone */}
              <div
                ref={dropZoneRef}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FaUpload className="text-4xl mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop images here or click to select
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports JPG, PNG, GIF, WebP. Images will be optimized automatically.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Select Images
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Project Assignment */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Project (Optional)
                </label>
                <select
                  value={uploadProject}
                  onChange={(e) => setUploadProject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No Project (Save to Interim)</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title || 'Untitled Project'}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Images will be saved directly to the selected project folder. Leave empty to save to interim folder.
                </p>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-3">Selected Files ({selectedFiles.length})</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <FaImage className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {getFileSize(file.size)} • {file.type}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {uploading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Uploading...</span>
                    <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadOpen(false);
                    setSelectedFiles([]);
                    setUploadProject('');
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || selectedFiles.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaUpload className="text-sm" />
                  {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Media Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Edit Image</h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Image Preview */}
                {formData.path && (
                  <div className="mb-4">
                    <img
                      src={formData.path}
                      alt={formData.alt || formData.description}
                      className="w-full max-h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filename
                    </label>
                    <input
                      type="text"
                      value={formData.filename}
                      onChange={(e) => handleFormChange('filename', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Format
                    </label>
                    <input
                      type="text"
                      value={formData.format}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Image description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.alt}
                    onChange={(e) => handleFormChange('alt', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Accessibility alt text"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="thumbnail">Thumbnail</option>
                      <option value="gallery">Gallery</option>
                      <option value="screenshot">Screenshot</option>
                      <option value="mockup">Mockup</option>
                      <option value="diagram">Diagram</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width × Height
                    </label>
                    <input
                      type="text"
                      value={`${formData.dimensions?.width || 0} × ${formData.dimensions?.height || 0}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <input
                      type="text"
                      value={formData.size}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign to Project
                  </label>
                  <select
                    value={formData.project}
                    onChange={(e) => handleFormChange('project', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">No Project (Interim Folder)</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title || 'Untitled Project'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags?.join(', ') || ''}
                    onChange={(e) => handleArrayChange('tags', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="web, mobile, design"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaSave className="text-sm" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaAdmin; 