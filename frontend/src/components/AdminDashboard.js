import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  FaProjectDiagram, 
  FaImage, 
  FaUser, 
  FaCogs, 
  FaTools, 
  FaBars, 
  FaTags,
  FaLink,
  FaChartBar,
  FaSave,
  FaUpload
} from 'react-icons/fa';

const sections = [
  {
    label: 'Projects',
    description: 'Manage portfolio projects and their details',
    icon: <FaProjectDiagram />,
    route: '/admin/projects',
    color: 'text-blue-600'
  },
  {
    label: 'Media Assets',
    description: 'Upload and organize images and media files',
    icon: <FaImage />,
    route: '/admin/media',
    color: 'text-green-600'
  },
  {
    label: 'Skills & Tools',
    description: 'Manage technical skills and tools',
    icon: <FaTools />,
    route: '/admin/skills',
    color: 'text-purple-600'
  },
  {
    label: 'Tags',
    description: 'Organize content with tags and categories',
    icon: <FaTags />,
    route: '/admin/tags',
    color: 'text-orange-600'
  },
  {
    label: 'Links',
    description: 'Manage external links and references',
    icon: <FaLink />,
    route: '/admin/links',
    color: 'text-red-600'
  },
  {
    label: 'About Info',
    description: 'Update personal information and bio',
    icon: <FaUser />,
    route: '/admin/about',
    color: 'text-indigo-600'
  },
  {
    label: 'Data Overview',
    description: 'View data relationships and statistics',
    icon: <FaChartBar />,
    route: '/admin/overview',
    color: 'text-teal-600'
  },
  {
    label: 'Settings',
    description: 'Configure site settings and preferences',
    icon: <FaCogs />,
    route: '/admin/settings',
    color: 'text-gray-600'
  }
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dataStats, setDataStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Load data statistics
  const loadDataStats = async () => {
    try {
      const stats = {};
      // Map section labels to actual file names
      const sectionMapping = {
        'Projects': 'projects',
        'Media Assets': 'media',
        'Skills & Tools': 'skills',
        'Tags': 'tags',
        'Links': 'links',
        'About Info': 'about'
      };
      
      for (const section of sections.slice(0, 6)) { // Skip overview and settings
        const type = sectionMapping[section.label] || section.label.toLowerCase().replace(/\s+/g, '');
        try {
          const response = await fetch(`http://localhost:3001/api/data/${type}`);
          if (response.ok) {
            const data = await response.json();
            const count = data[type] ? data[type].length : 0;
            stats[section.label.toLowerCase().replace(/\s+/g, '')] = count;
          }
        } catch (error) {
          console.warn(`Failed to load stats for ${type}:`, error);
          stats[section.label.toLowerCase().replace(/\s+/g, '')] = 0;
        }
      }
      setDataStats(stats);
    } catch (error) {
      console.error('Error loading data stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDataStats();
  }, []);

  const getActiveSection = () => {
    return sections.find(section => location.pathname.startsWith(section.route)) || sections[0];
  };

  const activeSection = getActiveSection();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 bg-white shadow-xl border-r border-gray-200 ${sidebarOpen ? 'w-72' : 'w-20'} flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
            )}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <FaBars className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sections.map((section) => {
            const isActive = location.pathname.startsWith(section.route);
            const stats = dataStats[section.label.toLowerCase().replace(/\s+/g, '')];
            
            return (
              <Link
                key={section.label}
                to={section.route}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                }`}
              >
                <span className={`text-xl ${isActive ? 'text-white' : section.color}`}>
                  {section.icon}
                </span>
                {sidebarOpen && (
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{section.label}</span>
                      {stats !== undefined && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isActive ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                          {stats}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${
                      isActive ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {section.description}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>Data Manager v2.0</p>
              <p className="mt-1">Connected to API</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{activeSection.label}</h1>
              <p className="text-gray-600 mt-1">{activeSection.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  // Reload all data stats
                  loadDataStats();
                  alert('All data refreshed from server');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaSave className="text-sm" />
                <span>Refresh Data</span>
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
                <FaUpload className="text-sm" />
                <span>Upload Files</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      alert(`Selected ${e.target.files.length} files. Use the Media section to upload them.`);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 