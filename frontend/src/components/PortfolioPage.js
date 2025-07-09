import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFilter } from '../context/FilterContext';
import FilterSidebar from './FilterSidebar';
import ProjectCard from './ProjectCard';
import ProjectCarousel from './ProjectCarousel';
import { getProjectsByDirectCategory, getCategoryInfo } from '../utils/categoryMapper';
import { getAllProjectsAsync } from '../utils/dataResolver';

const PortfolioPage = () => {
  const { category } = useParams();
  const { filteredProjects } = useFilter();
  const navigate = useNavigate();
  const [layout, setLayout] = useState('grid'); // 'grid', 'masonry', or 'carousel'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get category info
  const categoryInfo = useMemo(() => 
    category ? getCategoryInfo(category) : null, 
    [category]
  );
  
  // Load projects from API
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projects = await getAllProjectsAsync();
        setAllProjects(projects);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);
  const categoryProjects = useMemo(() => {
    // Use filtered projects if available, otherwise use all projects
    const projectsToFilter = filteredProjects.length > 0 ? filteredProjects : allProjects;
    
    if (category) {
      const filtered = getProjectsByDirectCategory(projectsToFilter, category);
      return filtered;
    }
    return projectsToFilter;
  }, [category, allProjects, filteredProjects]);

  // Determine layout based on category
  useEffect(() => {
    if (category === 'art') {
      setLayout('masonry');
    } else if (category === 'writing') {
      setLayout('carousel');
    } else {
      setLayout('grid');
    }
  }, [category]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClearFilters = () => {
    navigate('/portfolio');
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 'var(--spacing-2xl)' }}>
        <div className="neumorphic-raised" style={{ 
          padding: 'var(--spacing-2xl)', 
          textAlign: 'center'
        }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p style={{ marginTop: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
            Loading projects...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-2xl)' }}>
      {/* Page Header */}
      <div className="neumorphic-raised" style={{ 
        padding: 'var(--spacing-xl)', 
        marginBottom: 'var(--spacing-xl)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--spacing-md)'
      }}>
        <div>
          <h1 className="text-embossed" style={{ 
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
            marginBottom: 'var(--spacing-sm)'
          }}>
            {categoryInfo ? categoryInfo.label : 'Portfolio'}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {categoryProjects.length} project{categoryProjects.length !== 1 ? 's' : ''} found
            {categoryInfo && ` in ${categoryInfo.subtitle}`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Layout Toggle - Hidden on very small screens */}
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
            <button 
              className={`btn btn-pill ${layout === 'grid' ? 'neumorphic-inset' : ''}`}
              onClick={() => setLayout('grid')}
              style={{ 
                padding: 'var(--spacing-sm)',
                fontSize: '0.9rem'
              }}
            >
              Grid
            </button>
            <button 
              className={`btn btn-pill ${layout === 'masonry' ? 'neumorphic-inset' : ''}`}
              onClick={() => setLayout('masonry')}
              style={{ 
                padding: 'var(--spacing-sm)',
                fontSize: '0.9rem'
              }}
            >
              Masonry
            </button>
            <button 
              className={`btn btn-pill ${layout === 'carousel' ? 'neumorphic-inset' : ''}`}
              onClick={() => setLayout('carousel')}
              style={{ 
                padding: 'var(--spacing-sm)',
                fontSize: '0.9rem'
              }}
            >
              Carousel
            </button>
          </div>

          {/* Mobile Filter Toggle */}
          <button 
            className="btn btn-pill md:hidden"
            onClick={toggleSidebar}
            style={{ 
              padding: 'var(--spacing-sm) var(--spacing-md)'
            }}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>

          {/* Clear Filters */}
          <button 
            className="btn btn-pill"
            onClick={handleClearFilters}
            style={{ 
              padding: 'var(--spacing-sm) var(--spacing-md)',
              fontSize: '0.9rem'
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-xl)' }}>
        {/* Filter Sidebar - Hidden on mobile */}
        <aside className="hidden md:block" style={{ 
          width: '280px',
          flexShrink: 0,
          position: 'sticky',
          top: 'calc(var(--spacing-lg) + 80px)',
          height: 'fit-content'
        }}>
          <FilterSidebar />
        </aside>

        {/* Mobile Filter Overlay */}
        {isSidebarOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <div style={{
              width: '280px',
              height: '100%',
              backgroundColor: 'var(--bg-primary)',
              padding: 'var(--spacing-lg)',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h3>Filters</h3>
                <button 
                  className="btn btn-pill"
                  onClick={toggleSidebar}
                  style={{ padding: 'var(--spacing-sm)' }}
                >
                  ✕
                </button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        )}

        {/* Projects Display */}
        <main style={{ flex: '1', minWidth: 0 }}>
          {categoryProjects.length === 0 ? (
            <div className="neumorphic-raised" style={{ 
              padding: 'var(--spacing-2xl)', 
              textAlign: 'center'
            }}>
              <h2 className="text-embossed" style={{ marginBottom: 'var(--spacing-lg)' }}>
                No projects found
                {categoryInfo && ` in ${categoryInfo.label}`}
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                {categoryInfo 
                  ? `No ${categoryInfo.subtitle.toLowerCase()} projects found. Try adjusting your filters.`
                  : 'Try adjusting your filters or search terms.'
                }
              </p>
              <button 
                className="btn btn-pill"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          ) : layout === 'carousel' ? (
            <ProjectCarousel 
              maxProjects={categoryProjects.length}
              autoPlay={true}
              autoPlayInterval={5000}
            />
          ) : (
            <div className={layout === 'masonry' ? 'masonry' : 'grid'} style={{
              gridTemplateColumns: layout === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : undefined,
              gap: 'var(--spacing-lg)'
            }}>
              {categoryProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} layout={layout} index={index} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PortfolioPage; 