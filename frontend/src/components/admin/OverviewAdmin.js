import React, { useState, useEffect } from 'react';
import { FaProjectDiagram, FaImage, FaTools, FaTags, FaLink, FaUser, FaDatabase } from 'react-icons/fa';

const OverviewAdmin = () => {
  const [dataStats, setDataStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [relationships, setRelationships] = useState({});

  useEffect(() => {
    loadDataOverview();
  }, []);

  const loadDataOverview = async () => {
    try {
      setLoading(true);
      const stats = {};
      const rels = {};

      // Load all data types
      const dataTypes = ['projects', 'media', 'skills', 'tags', 'links', 'about'];
      
      for (const type of dataTypes) {
        try {
          const response = await fetch(`http://localhost:3001/api/data/${type}`);
          if (response.ok) {
            const data = await response.json();
            const items = data[type] || [];
            stats[type] = items.length;
            
            // Analyze relationships
            if (type === 'projects') {
              rels.projectsWithMedia = items.filter(p => p.images && p.images.length > 0).length;
              rels.projectsWithSkills = items.filter(p => p.technologies && p.technologies.length > 0).length;
              rels.projectsWithTags = items.filter(p => p.tags && p.tags.length > 0).length;
            }
          }
        } catch (error) {
          console.warn(`Failed to load ${type}:`, error);
          stats[type] = 0;
        }
      }

      setDataStats(stats);
      setRelationships(rels);
    } catch (error) {
      console.error('Error loading data overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDataTypeIcon = (type) => {
    const icons = {
      projects: <FaProjectDiagram className="text-2xl" />,
      media: <FaImage className="text-2xl" />,
      skills: <FaTools className="text-2xl" />,
      tags: <FaTags className="text-2xl" />,
      links: <FaLink className="text-2xl" />,
      about: <FaUser className="text-2xl" />
    };
    return icons[type] || <FaDatabase className="text-2xl" />;
  };

  const getDataTypeColor = (type) => {
    const colors = {
      projects: 'text-blue-600 bg-blue-50',
      media: 'text-green-600 bg-green-50',
      skills: 'text-purple-600 bg-purple-50',
      tags: 'text-orange-600 bg-orange-50',
      links: 'text-red-600 bg-red-50',
      about: 'text-indigo-600 bg-indigo-50'
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totalItems = Object.values(dataStats).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Data Overview</h2>
        <p className="text-gray-600 mt-1">View data relationships and statistics</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <FaDatabase className="text-3xl text-blue-500" />
            <div>
              <p className="text-3xl font-bold text-gray-800">{totalItems}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <FaProjectDiagram className="text-3xl text-green-500" />
            <div>
              <p className="text-3xl font-bold text-gray-800">{dataStats.projects || 0}</p>
              <p className="text-sm text-gray-600">Projects</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <FaImage className="text-3xl text-purple-500" />
            <div>
              <p className="text-3xl font-bold text-gray-800">{dataStats.media || 0}</p>
              <p className="text-sm text-gray-600">Media Files</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <FaTools className="text-3xl text-orange-500" />
            <div>
              <p className="text-3xl font-bold text-gray-800">{dataStats.skills || 0}</p>
              <p className="text-sm text-gray-600">Skills</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Type Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Type Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(dataStats).map(([type, count]) => (
              <div
                key={type}
                className={`p-4 rounded-lg border ${getDataTypeColor(type)}`}
              >
                <div className="flex items-center gap-3">
                  {getDataTypeIcon(type)}
                  <div>
                    <p className="font-semibold capitalize">{type}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Relationship Analysis */}
      {Object.keys(relationships).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Relationships</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaImage className="text-blue-600" />
                  <span className="font-medium text-blue-800">With Media</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{relationships.projectsWithMedia || 0}</p>
                <p className="text-sm text-blue-600">
                  of {dataStats.projects || 0} projects
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaTools className="text-green-600" />
                  <span className="font-medium text-green-800">With Skills</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{relationships.projectsWithSkills || 0}</p>
                <p className="text-sm text-green-600">
                  of {dataStats.projects || 0} projects
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaTags className="text-purple-600" />
                  <span className="font-medium text-purple-800">With Tags</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{relationships.projectsWithTags || 0}</p>
                <p className="text-sm text-purple-600">
                  of {dataStats.projects || 0} projects
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Health */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Health</h3>
          <div className="space-y-3">
            {dataStats.projects === 0 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-800">No projects found. Add some projects to get started.</span>
              </div>
            )}
            
            {dataStats.media === 0 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-800">No media files found. Upload some images for your projects.</span>
              </div>
            )}
            
            {dataStats.skills === 0 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-800">No skills defined. Add your technical skills and tools.</span>
              </div>
            )}

            {totalItems > 0 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-800">Data structure looks good! You have {totalItems} items across all categories.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FaProjectDiagram className="text-2xl text-blue-500 mb-2" />
              <p className="font-medium text-gray-800">Add New Project</p>
              <p className="text-sm text-gray-600">Create a new portfolio project</p>
            </button>

            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FaImage className="text-2xl text-green-500 mb-2" />
              <p className="font-medium text-gray-800">Upload Media</p>
              <p className="text-sm text-gray-600">Add images and media files</p>
            </button>

            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FaTools className="text-2xl text-purple-500 mb-2" />
              <p className="font-medium text-gray-800">Add Skills</p>
              <p className="text-sm text-gray-600">Define your technical skills</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewAdmin; 