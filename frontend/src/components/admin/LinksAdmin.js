import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSync, FaLink, FaExternalLinkAlt } from 'react-icons/fa';

const LinksAdmin = () => {
  const [links, setLinks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  
  const [formData, setFormData] = useState({
    id: '',
    type: 'demo',
    url: '',
    description: '',
    project: '',
    icon: '',
    label: '',
    status: 'active',
    priority: 50,
    tags: []
  });

  // Load links and projects data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      const [linksRes, projectsRes] = await Promise.all([
        fetch('http://localhost:3001/api/data/links'),
        fetch('http://localhost:3001/api/data/projects')
      ]);

      if (linksRes.ok) {
        const data = await linksRes.json();
        setLinks(data.links || []);
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

  const saveLinks = async (updatedLinks) => {
    try {
      const response = await fetch('http://localhost:3001/api/data/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: updatedLinks })
      });

      if (response.ok) {
        setLinks(updatedLinks);
        return true;
      } else {
        console.error('Save failed:', response.status);
      }
    } catch (error) {
      console.error('Error saving links:', error);
    }
    return false;
  };

  const handleAddLink = () => {
    const newLink = {
      id: `link-${Date.now()}`,
      type: 'demo',
      url: '',
      description: '',
      project: '',
      icon: '',
      label: '',
      status: 'active',
      priority: 50,
      tags: []
    };
    setFormData(newLink);
    setEditingLink(newLink);
    setIsFormOpen(true);
  };

  const handleEditLink = (link) => {
    setFormData({ ...link });
    setEditingLink(link);
    setIsFormOpen(true);
  };

  const handleDeleteLink = async (linkId) => {
    if (window.confirm('Are you sure you want to delete this link? This may affect projects that reference it.')) {
      const updatedLinks = links.filter(l => l.id !== linkId);
      const success = await saveLinks(updatedLinks);
      if (success) {
        await loadAllData();
        alert('Link deleted successfully');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const updatedLink = { ...formData };

    let updatedLinks;
    if (editingLink) {
      // Update existing link
      updatedLinks = links.map(l => 
        l.id === editingLink.id ? updatedLink : l
      );
    } else {
      // Add new link
      updatedLinks = [...links, updatedLink];
    }

    const success = await saveLinks(updatedLinks);
    if (success) {
      await loadAllData();
      setIsFormOpen(false);
      setEditingLink(null);
      setFormData({
        id: '',
        type: 'demo',
        url: '',
        description: '',
        project: '',
        icon: '',
        label: '',
        status: 'active',
        priority: 50,
        tags: []
      });
      alert('Link saved successfully');
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

  // Multiselect component for project relationships
  const ProjectSelect = ({ selectedId, onChange }) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Associated Project
        </label>
        <select
          value={selectedId}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">No Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title || 'Untitled Project'}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const getLinkIcon = (type) => {
    switch (type) {
      case 'demo': return <FaExternalLinkAlt />;
      case 'github': return <FaLink />;
      case 'linkedin': return <FaLink />;
      case 'twitter': return <FaLink />;
      case 'email': return <FaLink />;
      case 'website': return <FaLink />;
      case 'documentation': return <FaLink />;
      case 'video': return <FaLink />;
      case 'article': return <FaLink />;
      case 'download': return <FaLink />;
      default: return <FaLink />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'development': return 'bg-yellow-100 text-yellow-800';
      case 'private': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      case 'broken': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-800">Links Management</h2>
          <p className="text-gray-600 mt-1">Manage external links and references</p>
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
            onClick={handleAddLink}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="text-sm" />
            Add Link
          </button>
        </div>
      </div>

      {/* Type Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="demo">Demo</option>
            <option value="github">GitHub</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter</option>
            <option value="email">Email</option>
            <option value="website">Website</option>
            <option value="documentation">Documentation</option>
            <option value="video">Video</option>
            <option value="article">Article</option>
            <option value="download">Download</option>
          </select>
        </div>
      </div>

      {/* Links List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid gap-4">
            {links
              .filter(link => !selectedType || link.type === selectedType)
              .map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="text-lg text-gray-600">
                        {getLinkIcon(link.type)}
                      </div>
                      <h3 className="font-semibold text-gray-800">{link.label || link.description}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800`}>
                        {link.type}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(link.status)}`}>
                        {link.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        Priority: {link.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {link.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {link.url}
                      </a>
                      {link.project && (
                        <span className="text-xs text-gray-500">
                          Project: {projects.find(p => p.id === link.project)?.title || 'Unknown'}
                        </span>
                      )}
                    </div>
                    {link.tags?.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
                          Tags: {link.tags.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditLink(link)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit link"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete link"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            
            {links.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No links found. Click "Add Link" to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Link Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editingLink ? 'Edit Link' : 'Add New Link'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => handleFormChange('label', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Display label"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID
                    </label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => handleFormChange('id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="link-id"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL *
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => handleFormChange('url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Link description"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleFormChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="demo">Demo</option>
                      <option value="github">GitHub</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter</option>
                      <option value="email">Email</option>
                      <option value="website">Website</option>
                      <option value="documentation">Documentation</option>
                      <option value="video">Video</option>
                      <option value="article">Article</option>
                      <option value="download">Download</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="development">Development</option>
                      <option value="private">Private</option>
                      <option value="archived">Archived</option>
                      <option value="broken">Broken</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority (1-100)
                    </label>
                    <input
                      type="number"
                      value={formData.priority}
                      onChange={(e) => handleFormChange('priority', parseInt(e.target.value) || 50)}
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon (emoji)
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => handleFormChange('icon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="🔗"
                      maxLength={10}
                    />
                  </div>

                  <ProjectSelect
                    selectedId={formData.project}
                    onChange={(value) => handleFormChange('project', value)}
                  />
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
                    {editingLink ? 'Update Link' : 'Create Link'}
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

export default LinksAdmin; 