import React from 'react';
import { Link } from 'react-router-dom';
import { useFilter } from '../context/FilterContext';
import aboutData from '../data/about.json';
import projectsData from '../data/projects.json';

const HomePage = () => {
  const { filteredProjects } = useFilter();
  
  // Get featured project
  const featuredProject = projectsData.projects.find(project => project.highlight);

  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-2xl)' }}>
      {/* Hero Section */}
      <section className="neumorphic-raised" style={{ 
        padding: 'var(--spacing-2xl)', 
        marginBottom: 'var(--spacing-2xl)',
        textAlign: 'center'
      }}>
        <h1 className="text-embossed" style={{ 
          fontSize: '3rem', 
          marginBottom: 'var(--spacing-lg)',
          fontFamily: 'var(--font-display)'
        }}>
          {aboutData.name}
        </h1>
        <p className="text-engraved" style={{ 
          fontSize: '1.5rem', 
          marginBottom: 'var(--spacing-xl)',
          maxWidth: '600px',
          margin: '0 auto var(--spacing-xl)'
        }}>
          {aboutData.headline}
        </p>
        <p style={{ 
          fontSize: '1.1rem', 
          marginBottom: 'var(--spacing-2xl)',
          maxWidth: '800px',
          margin: '0 auto var(--spacing-2xl)',
          color: 'var(--text-secondary)'
        }}>
          {aboutData.bio}
        </p>

        {/* Category Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-lg)', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/portfolio" className="btn btn-circular" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>CODE</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Development</span>
          </Link>
          <Link to="/portfolio" className="btn btn-circular" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>ART</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Creative</span>
          </Link>
          <Link to="/portfolio" className="btn btn-circular" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>WRITE</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Narrative</span>
          </Link>
        </div>
      </section>

      {/* Featured Project */}
      {featuredProject && (
        <section className="neumorphic-raised" style={{ 
          padding: 'var(--spacing-2xl)', 
          marginBottom: 'var(--spacing-2xl)'
        }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-2xl)', alignItems: 'center' }}>
            <div style={{ flex: '1' }}>
              <h2 className="text-embossed" style={{ 
                fontSize: '2rem', 
                marginBottom: 'var(--spacing-md)'
              }}>
                Featured Project
              </h2>
              <h3 style={{ 
                fontSize: '1.5rem', 
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--accent-primary)'
              }}>
                {featuredProject.title}
              </h3>
              <p style={{ 
                fontSize: '1.1rem', 
                marginBottom: 'var(--spacing-md)',
                color: 'var(--text-secondary)'
              }}>
                {featuredProject.subtitle}
              </p>
              <p style={{ 
                marginBottom: 'var(--spacing-lg)',
                lineHeight: 1.6
              }}>
                {featuredProject.description}
              </p>
              
              {/* Project Tags */}
              <div style={{ 
                display: 'flex', 
                gap: 'var(--spacing-sm)', 
                flexWrap: 'wrap',
                marginBottom: 'var(--spacing-lg)'
              }}>
                {featuredProject.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="neumorphic-inset" style={{
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              <Link 
                to={`/project/${featuredProject.slug}`} 
                className="btn btn-pill"
                style={{ textDecoration: 'none' }}
              >
                View Project
              </Link>
            </div>

            <div style={{ flex: '1', textAlign: 'center' }}>
              <div className="neumorphic-inset" style={{
                width: '300px',
                height: '200px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: `url(${featuredProject.media.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 'var(--radius-md)'
              }}>
                {!featuredProject.media.thumbnail && (
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Project Preview
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Stats */}
      <section className="neumorphic-raised" style={{ 
        padding: 'var(--spacing-xl)', 
        marginBottom: 'var(--spacing-2xl)'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-lg)',
          textAlign: 'center'
        }}>
          <div>
            <h3 className="text-embossed" style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>
              {projectsData.projects.length}
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>Projects</p>
          </div>
          <div>
            <h3 className="text-embossed" style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>
              {new Set(projectsData.projects.flatMap(p => p.tools)).size}
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>Technologies</p>
          </div>
          <div>
            <h3 className="text-embossed" style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>
              {new Set(projectsData.projects.flatMap(p => p.type)).size}
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>Categories</p>
          </div>
          <div>
            <h3 className="text-embossed" style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>
              {new Date().getFullYear() - 2020}
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>Years Experience</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="neumorphic-raised" style={{ 
        padding: 'var(--spacing-2xl)', 
        textAlign: 'center'
      }}>
        <h2 className="text-embossed" style={{ 
          fontSize: '2rem', 
          marginBottom: 'var(--spacing-lg)'
        }}>
          Ready to explore?
        </h2>
        <p style={{ 
          fontSize: '1.1rem', 
          marginBottom: 'var(--spacing-xl)',
          color: 'var(--text-secondary)'
        }}>
          Dive into the full portfolio to discover projects across code, art, and writing.
        </p>
        <Link 
          to="/portfolio" 
          className="btn btn-pill"
          style={{ textDecoration: 'none' }}
        >
          Explore Portfolio
        </Link>
      </section>
    </div>
  );
};

export default HomePage; 