import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFilter } from '../context/FilterContext';
import FilterSidebar from './FilterSidebar';
import ProjectCard from './ProjectCard';

const PortfolioPage = () => {
  const { category } = useParams();
  const { filteredProjects, updateFilter, clearFilters } = useFilter();
  const [layout, setLayout] = useState('grid'); // 'grid' or 'masonry'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Set initial filter based on URL category
  useEffect(() => {
    if (category) {
      updateFilter('medium', category);
    }
  }, [category, updateFilter]);

  // Determine layout based on category
  useEffect(() => {
    if (category === 'art') {
      setLayout('masonry');
    } else {
      setLayout('grid');
    }
  }, [category]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
            fontSize: '2.5rem', 
            marginBottom: 'var(--spacing-sm)'
          }}>
            Portfolio
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          {/* Layout Toggle */}
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
          </div>

          {/* Mobile Filter Toggle */}
          <button 
            className="btn btn-pill"
            onClick={toggleSidebar}
            style={{ 
              display: 'none',
              padding: 'var(--spacing-sm) var(--spacing-md)'
            }}
          >
            Filters
          </button>

          {/* Clear Filters */}
          <button 
            className="btn btn-pill"
            onClick={clearFilters}
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
        {/* Filter Sidebar */}
        <aside style={{ 
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

        {/* Projects Grid */}
        <main style={{ flex: '1' }}>
          {filteredProjects.length === 0 ? (
            <div className="neumorphic-raised" style={{ 
              padding: 'var(--spacing-2xl)', 
              textAlign: 'center'
            }}>
              <h2 className="text-embossed" style={{ marginBottom: 'var(--spacing-lg)' }}>
                No projects found
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                Try adjusting your filters or search terms.
              </p>
              <button 
                className="btn btn-pill"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={layout === 'masonry' ? 'masonry' : 'grid'} style={{
              gridTemplateColumns: layout === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : undefined
            }}>
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} layout={layout} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Responsive Design */}
      <style jsx>{`
        @media (max-width: 1024px) {
          aside {
            display: none;
          }
          
          button[onClick="${toggleSidebar}"] {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PortfolioPage; 