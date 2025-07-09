import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSync } from 'react-icons/fa';

const TypesAdmin = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingType, setEditingType] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    label: '',
    description: '',
    category: 'creative',
    icon: '',
    color: '#3B82F6',
    priority: 50
  });

  // Load types data
  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/data/types');
      if (response.ok) {
        const data = await response.json();
        setTypes(data.types || []);
      } else {
        console.error('Failed to load types:', response.status);
      }
    } catch (error) {
      console.error('Error loading types:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTypes = async (updatedTypes) => {
    try {
      const response = await fetch('http://localhost:3001/api/data/types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ types: updatedTypes })
      });

      if (response.ok) {
        setTypes(updatedTypes);
        return true;
      } else {
        console.error('Save failed:', response.status);
      }
    } catch (error) {
      console.error('Error saving types:', error);
    }
    return false;
  };

  const handleAddType = () => {
    const newType = {
      id: `type-${Date.now()}`,
      label: '',
      description: '',
      category: 'creative',
      icon: '',
      color: '#3B82F6',
      priority: 50
    };
    setFormData(newType);
    setEditingType(newType);
    setIsFormOpen(true);
  };

  const handleEditType = (type) => {
    setFormData({ ...type });
    setEditingType(type);
    setIsFormOpen(true);
  };

  const handleDeleteType = async (typeId) => {
    if (window.confirm('Are you sure you want to delete this type? This may affect projects that reference it.')) {
      const updatedTypes = types.filter(t => t.id !== typeId);
      const success = await saveTypes(updatedTypes);
      if (success) {
        await loadTypes();
        alert('Type deleted successfully');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const updatedType = { ...formData };

    let updatedTypes;
    if (editingType) {
      // Update existing type
      updatedTypes = types.map(t => 
        t.id === editingType.id ? updatedType : t
      );
    } else {
      // Add new type
      updatedTypes = [...types, updatedType];
    }

    const success = await saveTypes(updatedTypes);
    if (success) {
      await loadTypes();
      setIsFormOpen(false);
      setEditingType(null);
      setFormData({
        id: '',
        label: '',
        description: '',
        category: 'creative',
        icon: '',
        color: '#3B82F6',
        priority: 50
      });
      alert('Type saved successfully');
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
          <h2 className="text-2xl font-bold text-gray-800">Types Management</h2>
          <p className="text-gray-600 mt-1">Manage project types and categories</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadTypes}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FaSync className="text-sm" />
            Refresh
          </button>
          <button
            onClick={handleAddType}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="text-sm" />
            Add Type
          </button>
        </div>
      </div>

      {/* Types List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid gap-4">
            {types.map((type) => (
              <div
                key={type.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {type.icon && (
                      <span className="text-xl">{type.icon}</span>
                    )}
                    <h3 className="font-semibold text-gray-800">{type.label}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800`}>
                      {type.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      Priority: {type.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    {type.description}
                  </p>
                  {type.color && (
                    <div className="flex items-center gap-2 mt-2">
                      <div 
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: type.color }}
                      ></div>
                      <span className="text-xs text-gray-500">{type.color}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditType(type)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit type"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteType(type.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete type"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            {types.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No types found. Click "Add Type" to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Type Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editingType ? 'Edit Type' : 'Add New Type'}
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
                      placeholder="type-id"
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
                    placeholder="Type description"
                    required
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
                      <option value="creative">Creative</option>
                      <option value="development">Development</option>
                      <option value="ai">AI</option>
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
                      placeholder="🎨"
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority (1-100, 1 being highest)
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
                    {editingType ? 'Update Type' : 'Create Type'}
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

export default TypesAdmin; 