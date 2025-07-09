import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSync, FaFolder, FaCode } from 'react-icons/fa';
import tagsData from '../../data/tags.json';

const CATEGORY_TAGS = ['art', 'code', 'writing'];
const CATEGORY_TAG_INFO = CATEGORY_TAGS.map(id => tagsData.tags.find(tag => tag.id === id));

const SkillsAdmin = () => {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    level: 50,
    icon: '',
    color: '#3B82F6',
    years: 1,
    category: '',
    certifications: [],
    projects: []
  });

  // Load skills and projects data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      const [skillsRes, projectsRes] = await Promise.all([
        fetch('http://localhost:3001/api/data/skills'),
        fetch('http://localhost:3001/api/data/projects')
      ]);

      if (skillsRes.ok) {
        const data = await skillsRes.json();
        setSkills(data.skills || []);
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

  const saveSkills = async (updatedSkills) => {
    try {
      const response = await fetch('http://localhost:3001/api/data/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: updatedSkills })
      });

      if (response.ok) {
        setSkills(updatedSkills);
        return true;
      } else {
        console.error('Save failed:', response.status);
      }
    } catch (error) {
      console.error('Error saving skills:', error);
    }
    return false;
  };

  const handleAddSkill = () => {
    const newSkill = {
      id: `skill-${Date.now()}`,
      name: '',
      description: '',
      level: 50,
      icon: '',
      color: '#3B82F6',
      years: 1,
      category: selectedCategory || '',
      certifications: [],
      projects: []
    };
    setFormData(newSkill);
    setEditingSkill(newSkill);
    setIsFormOpen(true);
  };

  const handleEditSkill = (skill) => {
    setFormData({ ...skill });
    setEditingSkill(skill);
    setIsFormOpen(true);
  };

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill? This may affect projects that reference it.')) {
      const updatedSkills = skills.map(category => ({
        ...category,
        skills: category.skills.filter(s => s.id !== skillId)
      }));
      const success = await saveSkills(updatedSkills);
      if (success) {
        await loadAllData();
        alert('Skill deleted successfully');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const updatedSkill = { ...formData };

    // Find the category and update/add the skill
    let updatedSkills = [...skills];
    const categoryIndex = updatedSkills.findIndex(cat => cat.category === updatedSkill.category);
    
    if (categoryIndex >= 0) {
      // Category exists, update or add skill
      const skillIndex = updatedSkills[categoryIndex].skills.findIndex(s => s.id === updatedSkill.id);
      if (skillIndex >= 0) {
        // Update existing skill
        updatedSkills[categoryIndex].skills[skillIndex] = updatedSkill;
      } else {
        // Add new skill to existing category
        updatedSkills[categoryIndex].skills.push(updatedSkill);
      }
    } else {
      // Create new category with skill
      updatedSkills.push({
        category: updatedSkill.category,
        description: `${updatedSkill.category} skills`,
        icon: '💼',
        color: '#3B82F6',
        skills: [updatedSkill]
      });
    }

    const success = await saveSkills(updatedSkills);
    if (success) {
      await loadAllData();
      setIsFormOpen(false);
      setEditingSkill(null);
      setFormData({
        id: '',
        name: '',
        description: '',
        level: 50,
        icon: '',
        color: '#3B82F6',
        years: 1,
        category: '',
        certifications: [],
        projects: []
      });
      alert('Skill saved successfully');
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
  const ProjectMultiSelect = ({ selectedIds, onChange }) => {
    const handleToggle = (projectId) => {
      const newSelected = selectedIds.includes(projectId)
        ? selectedIds.filter(id => id !== projectId)
        : [...selectedIds, projectId];
      onChange(newSelected);
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Related Projects
        </label>
        <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
          {projects.length === 0 ? (
            <p className="text-gray-500 text-sm">No projects available</p>
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                <label key={project.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(project.id)}
                    onChange={() => handleToggle(project.id)}
                    className="mr-2"
                  />
                  <span className="text-sm">{project.title || 'Untitled Project'}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        {selectedIds.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              Selected: {selectedIds.length} project(s)
            </p>
          </div>
        )}
      </div>
    );
  };

  // Filtered skills by selected category tag
  const filteredSkills = selectedCategory
    ? skills.filter(cat => cat.category.toLowerCase() === CATEGORY_TAG_INFO.find(t => t.id === selectedCategory)?.label.toLowerCase())
    : skills;

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
          <h2 className="text-2xl font-bold text-gray-800">Skills Management</h2>
          <p className="text-gray-600 mt-1">Manage skills organized by categories</p>
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
            onClick={handleAddSkill}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="text-sm" />
            Add Skill
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-semibold">Filter by Category:</span>
          {CATEGORY_TAG_INFO.map(tag => (
            <button
              key={tag.id}
              onClick={() => setSelectedCategory(tag.id === selectedCategory ? '' : tag.id)}
              style={{
                border: `2px solid ${tag.color}`,
                background: tag.id === selectedCategory ? tag.color : 'transparent',
                color: tag.id === selectedCategory ? '#222' : tag.color,
                borderRadius: 'var(--radius-full)',
                padding: '0.4em 1.2em',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                marginRight: '0.5em',
                transition: 'all 0.2s',
                boxShadow: tag.id === selectedCategory ? `0 0 8px ${tag.color}` : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5em',
              }}
            >
              <span style={{ fontSize: '1.2em' }}>{tag.icon}</span>
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skills List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="space-y-6">
            {filteredSkills
              .map((category) => (
                <div key={category.category} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    {category.icon && <span className="text-xl">{category.icon}</span>}
                    <h3 className="text-lg font-semibold text-gray-800">{category.category}</h3>
                    <span className="text-sm text-gray-500">{category.description}</span>
                  </div>
                  
                  <div className="grid gap-3">
                    {category.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            {skill.icon && <span className="text-lg">{skill.icon}</span>}
                            <h4 className="font-medium text-gray-800">{skill.name}</h4>
                            <span className="text-sm text-gray-500">Level: {skill.level}%</span>
                            <span className="text-sm text-gray-500">{skill.years} years</span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            {skill.description}
                          </p>
                          {skill.projects?.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-gray-500">
                                Used in {skill.projects.length} project(s)
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditSkill(skill)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit skill"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete skill"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            
            {filteredSkills.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No skills found. Click "Add Skill" to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skill Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
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
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
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
                      placeholder="skill-id"
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
                    placeholder="Skill description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <option value="">Select Category</option>
                      {skills.map(cat => (
                        <option key={cat.category} value={cat.category}>
                          {cat.category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level (0-100)
                    </label>
                    <input
                      type="number"
                      value={formData.level}
                      onChange={(e) => handleFormChange('level', parseInt(e.target.value) || 50)}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={formData.years}
                      onChange={(e) => handleFormChange('years', parseInt(e.target.value) || 1)}
                      min="0"
                      max="50"
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
                      placeholder="💻"
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
                    Certifications (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.certifications?.join(', ') || ''}
                    onChange={(e) => handleArrayChange('certifications', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="AWS Certified, Google Cloud"
                  />
                </div>

                <ProjectMultiSelect
                  selectedIds={formData.projects || []}
                  onChange={(value) => handleFormChange('projects', value)}
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
                    {editingSkill ? 'Update Skill' : 'Create Skill'}
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

export default SkillsAdmin; 