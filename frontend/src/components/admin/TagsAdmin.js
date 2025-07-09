import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSync, FaTag } from 'react-icons/fa';

const TagsAdmin = () => {
  const [tags, setTags] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTag, setEditingTag] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [formData, setFormData] = useState({
    id: '',
    label: '',
    description: '',
    emotion: '',
    visual: '',
    category: 'technology',
    color: '#3B82F6',
    icon: '',
    priority: 50,
    related: []
  });

  // Load tags and projects data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      const [tagsRes, projectsRes] = await Promise.all([
        fetch('http://localhost:3001/api/data/tags'),
        fetch('http://localhost:3001/api/data/projects')
      ]);

      if (tagsRes.ok) {
        const data = await tagsRes.json();
        setTags(data.tags || []);
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

  const saveTags = async (updatedTags) => {
    try {
      const response = await fetch('http://localhost:3001/api/data/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: updatedTags })
      });

      if (response.ok) {
        setTags(updatedTags);
        return true;
      } else {
        console.error('Save failed:', response.status);
      }
    } catch (error) {
      console.error('Error saving tags:', error);
    }
    return false;
  };

  const handleAddTag = () => {
    const newTag = {
      id: `tag-${Date.now()}`,
      label: '',
      description: '',
      emotion: '',
      visual: '',
      category: selectedCategory || 'technology',
      color: '#3B82F6',
      icon: '',
      priority: 50,
      usage: 0,
      related: []
    };
    setFormData(newTag);
    setEditingTag(newTag);
    setIsFormOpen(true);
  };

  const handleEditTag = (tag) => {
    setFormData({ ...tag });
    setEditingTag(tag);
    setIsFormOpen(true);
  };

  const handleDeleteTag = async (tagId) => {
    if (window.confirm('Are you sure you want to delete this tag? This may affect projects that reference it.')) {
      const updatedTags = tags.filter(t => t.id !== tagId);
      const success = await saveTags(updatedTags);
      if (success) {
        await loadAllData();
        alert('Tag deleted successfully');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const updatedTag = { ...formData };

    let updatedTags;
    if (editingTag) {
      // Update existing tag
      updatedTags = tags.map(t => 
        t.id === editingTag.id ? updatedTag : t
      );
    } else {
      // Add new tag
      updatedTags = [...tags, updatedTag];
    }

    const success = await saveTags(updatedTags);
    if (success) {
      await loadAllData();
      setIsFormOpen(false);
      setEditingTag(null);
      setFormData({
        id: '',
        label: '',
        description: '',
        emotion: '',
        visual: '',
        category: 'technology',
        color: '#3B82F6',
        icon: '',
        priority: 50,
        related: []
      });
      alert('Tag saved successfully');
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

  // Multiselect component for related tags
  const RelatedTagsMultiSelect = ({ selectedIds, onChange }) => {
    const handleToggle = (tagId) => {
      const newSelected = selectedIds.includes(tagId)
        ? selectedIds.filter(id => id !== tagId)
        : [...selectedIds, tagId];
      onChange(newSelected);
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Related Tags
        </label>
        <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
          {tags.length === 0 ? (
            <p className="text-gray-500 text-sm">No tags available</p>
          ) : (
            <div className="space-y-2">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(tag.id)}
                    onChange={() => handleToggle(tag.id)}
                    className="mr-2"
                  />
                  <span className="text-sm">{tag.label}</span>
                  {tag.category && (
                    <span className="text-gray-500 ml-1">({tag.category})</span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
        {selectedIds.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              Selected: {selectedIds.length} tag(s)
            </p>
          </div>
        )}
      </div>
    );
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
          <h2 className="text-2xl font-bold text-gray-800">Tags Management</h2>
          <p className="text-gray-600 mt-1">Manage project tags and categories</p>
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
            onClick={handleAddTag}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="text-sm" />
            Add Tag
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="technology">Technology</option>
            <option value="aesthetic">Aesthetic</option>
            <option value="mood">Mood</option>
            <option value="platform">Platform</option>
            <option value="game">Game</option>
            <option value="content">Content</option>
            <option value="experience">Experience</option>
            <option value="language">Language</option>
            <option value="creative">Creative</option>
            <option value="social">Social</option>
            <option value="environment">Environment</option>
            <option value="design">Design</option>
            <option value="personal">Personal</option>
          </select>
        </div>
      </div>

      {/* Tags List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid gap-4">
            {tags
              .filter(tag => !selectedCategory || tag.category === selectedCategory)
              .map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {tag.icon && <span className="text-lg">{tag.icon}</span>}
                      <h3 className="font-semibold text-gray-800">{tag.label}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800`}>
                        {tag.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        Priority: {tag.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        Usage: {tag.usage || 0}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {tag.description}
                    </p>
                    {(tag.emotion || tag.visual) && (
                      <div className="flex items-center gap-4 mt-2">
                        {tag.emotion && (
                          <span className="text-xs text-gray-500">
                            Emotion: {tag.emotion}
                          </span>
                        )}
                        {tag.visual && (
                          <span className="text-xs text-gray-500">
                            Visual: {tag.visual}
                          </span>
                        )}
                      </div>
                    )}
                    {tag.related?.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
                          Related: {tag.related.length} tag(s)
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditTag(tag)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit tag"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete tag"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            
            {tags.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No tags found. Click "Add Tag" to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tag Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editingTag ? 'Edit Tag' : 'Add New Tag'}
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
                      Label *
                    </label>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => handleFormChange('label', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
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
                      placeholder="tag-id"
                    />
                  </div>
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
                    placeholder="Tag description"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emotion
                    </label>
                    <input
                      type="text"
                      value={formData.emotion}
                      onChange={(e) => handleFormChange('emotion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., electrified nostalgia"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visual
                    </label>
                    <input
                      type="text"
                      value={formData.visual}
                      onChange={(e) => handleFormChange('visual', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., neon cyberpunk"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="technology">Technology</option>
                      <option value="aesthetic">Aesthetic</option>
                      <option value="mood">Mood</option>
                      <option value="platform">Platform</option>
                      <option value="game">Game</option>
                      <option value="content">Content</option>
                      <option value="experience">Experience</option>
                      <option value="language">Language</option>
                      <option value="creative">Creative</option>
                      <option value="social">Social</option>
                      <option value="environment">Environment</option>
                      <option value="design">Design</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon (emoji)
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => handleFormChange('icon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="🏷️"
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => handleFormChange('color', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
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

                <RelatedTagsMultiSelect
                  selectedIds={formData.related || []}
                  onChange={(value) => handleFormChange('related', value)}
                />

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
                    {editingTag ? 'Update Tag' : 'Create Tag'}
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

export default TagsAdmin; 