import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSync } from 'react-icons/fa';

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Related data state
  const [types, setTypes] = useState([]);
  const [skills, setSkills] = useState([]);
  const [tags, setTags] = useState([]);
  const [media, setMedia] = useState([]);
  const [links, setLinks] = useState([]);
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    shortDescription: '',
    slug: '',
    technologies: [],
    tags: [],
    images: [],
    featured: false,
    order: 0,
    status: 'published'
  });

  // Load all data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Load all related data in parallel
      const [projectsRes, typesRes, skillsRes, tagsRes, mediaRes, linksRes] = await Promise.all([
        fetch('http://localhost:3001/api/data/projects'),
        fetch('http://localhost:3001/api/data/types'),
        fetch('http://localhost:3001/api/data/skills'),
        fetch('http://localhost:3001/api/data/tags'),
        fetch('http://localhost:3001/api/data/media'),
        fetch('http://localhost:3001/api/data/links')
      ]);

      if (projectsRes.ok) {
        const data = await projectsRes.json();
        console.log('Loaded projects data:', data);
        setProjects(data.projects || []);
      }

      if (typesRes.ok) {
        const data = await typesRes.json();
        setTypes(data.types || []);
      }

      if (skillsRes.ok) {
        const data = await skillsRes.json();
        // Flatten skills from categories
        const flattenedSkills = data.skills?.flatMap(category => 
          category.skills?.map(skill => ({
            ...skill,
            category: category.category
          })) || []
        ) || [];
        setSkills(flattenedSkills);
      }

      if (tagsRes.ok) {
        const data = await tagsRes.json();
        setTags(data.tags || []);
      }

      if (mediaRes.ok) {
        const data = await mediaRes.json();
        setMedia(data.media || []);
      }

      if (linksRes.ok) {
        const data = await linksRes.json();
        setLinks(data.links || []);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProjects = async (updatedProjects) => {
    try {
      console.log('Saving projects:', updatedProjects);
      const response = await fetch('http://localhost:3001/api/data/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: updatedProjects })
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        setProjects(updatedProjects);
        console.log('Projects saved successfully, updated state:', updatedProjects);
        return true;
      } else {
        console.error('Save failed:', responseData);
      }
    } catch (error) {
      console.error('Error saving projects:', error);
    }
    return false;
  };

  const handleAddProject = () => {
    const newProject = {
      id: `project-${Date.now()}`,
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
      status: 'draft',
      difficulty: 'intermediate',
      createdAt: new Date().toISOString()
    };
    setFormData(newProject);
    setEditingProject(newProject);
    setIsFormOpen(true);
  };

  const handleEditProject = (project) => {
    setFormData({ ...project });
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      const success = await saveProjects(updatedProjects);
      if (success) {
        await loadAllData();
        alert('Project deleted successfully');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const updatedProject = { ...formData };
    if (!updatedProject.createdAt) {
      updatedProject.createdAt = new Date().toISOString();
    }
    updatedProject.updatedAt = new Date().toISOString();

    let updatedProjects;
    if (editingProject) {
      // Update existing project
      updatedProjects = projects.map(p => 
        p.id === editingProject.id ? updatedProject : p
      );
    } else {
      // Add new project
      updatedProjects = [...projects, updatedProject];
    }

    console.log('Form submitted, updatedProject:', updatedProject);
    const success = await saveProjects(updatedProjects);
    console.log('Save result:', success);
    if (success) {
      console.log('Reloading data...');
      await loadAllData();
      setIsFormOpen(false);
      setEditingProject(null);
      setFormData({
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
        status: 'draft',
        difficulty: 'intermediate'
      });
      alert('Project saved successfully');
    } else {
      alert('Failed to save project. Check console for details.');
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Multiselect component for relationships
  const MultiSelect = ({ 
    label, 
    options, 
    selectedIds, 
    onChange, 
    placeholder,
    displayField = 'label',
    idField = 'id'
  }) => {
    const handleToggle = (itemId) => {
      const newSelected = selectedIds.includes(itemId)
        ? selectedIds.filter(id => id !== itemId)
        : [...selectedIds, itemId];
      onChange(newSelected);
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
          {options.length === 0 ? (
            <p className="text-gray-500 text-sm">{placeholder}</p>
          ) : (
            <div className="space-y-2">
              {options.map((option) => (
                <label key={option[idField]} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(option[idField])}
                    onChange={() => handleToggle(option[idField])}
                    className="mr-2"
                  />
                  <span className="text-sm">
                    {option[displayField]}
                    {option.category && (
                      <span className="text-gray-500 ml-1">({option.category})</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
        {selectedIds.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              Selected: {selectedIds.length} item(s)
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
          <h2 className="text-2xl font-bold text-gray-800">Projects Management</h2>
          <p className="text-gray-600 mt-1">Manage your portfolio projects</p>
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
            onClick={handleAddProject}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="text-sm" />
            Add Project
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-800">{project.title || 'Untitled Project'}</h3>
                    {project.highlight && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Highlight
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : project.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    {project.subtitle || 'No subtitle'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">
                      Types: {project.typeIds?.length || 0}
                    </span>
                    <span className="text-xs text-gray-500">
                      Tools: {project.toolIds?.length || 0}
                    </span>
                    <span className="text-xs text-gray-500">
                      Tags: {project.tagIds?.length || 0}
                    </span>
                    <span className="text-xs text-gray-500">
                      Media: {project.mediaIds?.length || 0}
                    </span>
                    <span className="text-xs text-gray-500">
                      Links: {project.linkIds?.length || 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit project"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete project"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No projects found. Click "Add Project" to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleFormChange('slug', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="project-slug"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleFormChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief project subtitle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Detailed project description"
                  />
                </div>

                {/* Relationships */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MultiSelect
                    label="Project Types"
                    options={types}
                    selectedIds={formData.typeIds || []}
                    onChange={(value) => handleFormChange('typeIds', value)}
                    placeholder="No project types available"
                  />

                  <MultiSelect
                    label="Tools & Skills"
                    options={skills}
                    selectedIds={formData.toolIds || []}
                    onChange={(value) => handleFormChange('toolIds', value)}
                    placeholder="No skills available"
                    displayField="name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MultiSelect
                    label="Tags"
                    options={tags}
                    selectedIds={formData.tagIds || []}
                    onChange={(value) => handleFormChange('tagIds', value)}
                    placeholder="No tags available"
                  />

                  <MultiSelect
                    label="Media Assets"
                    options={media}
                    selectedIds={formData.mediaIds || []}
                    onChange={(value) => handleFormChange('mediaIds', value)}
                    placeholder="No media available"
                    displayField="filename"
                  />
                </div>

                <MultiSelect
                  label="Links"
                  options={links}
                  selectedIds={formData.linkIds || []}
                  onChange={(value) => handleFormChange('linkIds', value)}
                  placeholder="No links available"
                />

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleFormChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                      <option value="draft">Draft</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="planned">Planned</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => handleFormChange('difficulty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
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

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.highlight}
                        onChange={(e) => handleFormChange('highlight', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Highlight Project</span>
                    </label>
                  </div>
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
                    {editingProject ? 'Update Project' : 'Create Project'}
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

export default ProjectsAdmin; 