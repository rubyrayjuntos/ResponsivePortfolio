import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import projectsData from '../data/projects.json';

const ProjectDetail = () => {
  const { slug } = useParams();
  const { changeTheme, resetTheme } = useTheme();
  const [project, setProject] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  // Find project by slug
  useEffect(() => {
    const foundProject = projectsData.projects.find(p => p.slug === slug);
    setProject(foundProject);
  }, [slug]);

  // Apply theme based on project emotion
  useEffect(() => {
    if (project) {
      // Map emotions to themes
      const emotionToTheme = {
        'electrified nostalgia': 'playful',
        'sacred seduction': 'mystical',
        'divine co-creation': 'mystical',
        'empowered clarity': 'professional',
        'divine professionalism': 'professional'
      };
      
      const theme = emotionToTheme[project.emotion] || 'default';
      changeTheme(theme);

      // Reset theme when component unmounts
      return () => {
        resetTheme();
      };
    }
  }, [project, changeTheme, resetTheme]);

  if (!project) {
    return (
      <div className="container" style={{ paddingTop: 'var(--spacing-2xl)' }}>
        <div className="neumorphic-raised" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
          <h1>Project not found</h1>
          <Link to="/portfolio" className="btn btn-pill" style={{ textDecoration: 'none' }}>
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-2xl)' }}>
      {/* Back Button */}
      <Link 
        to="/portfolio" 
        className="btn btn-pill"
        style={{ 
          textDecoration: 'none',
          marginBottom: 'var(--spacing-lg)',
          display: 'inline-block'
        }}
      >
        ← Back to Portfolio
      </Link>

      {/* Project Header */}
      <section className="neumorphic-raised" style={{ 
        padding: 'var(--spacing-2xl)', 
        marginBottom: 'var(--spacing-xl)'
      }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-2xl)', alignItems: 'flex-start' }}>
          {/* Project Info */}
          <div style={{ flex: '1' }}>
            <h1 className="text-embossed" style={{ 
              fontSize: '2.5rem', 
              marginBottom: 'var(--spacing-md)'
            }}>
              {project.title}
            </h1>
            <p style={{ 
              fontSize: '1.3rem', 
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--accent-primary)'
            }}>
              {project.subtitle}
            </p>
            <p style={{ 
              fontSize: '1.1rem', 
              lineHeight: 1.7,
              marginBottom: 'var(--spacing-xl)'
            }}>
              {project.description}
            </p>

            {/* Project Metadata */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-xl)'
            }}>
              <div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--accent-primary)' }}>Year</h3>
                <p>{project.year}</p>
              </div>
              <div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--accent-primary)' }}>Type</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                  {project.type.map(type => (
                    <span key={type} style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--bg-primary)',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem'
                    }}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--accent-primary)' }}>Tools</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                  {project.tools.map(tool => (
                    <span key={tool} style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem'
                    }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Links */}
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
              {project.links.demo && (
                <a 
                  href={project.links.demo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-pill"
                  style={{ textDecoration: 'none' }}
                >
                  View Demo
                </a>
              )}
              {project.links.github && (
                <a 
                  href={project.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-pill"
                  style={{ textDecoration: 'none' }}
                >
                  View Code
                </a>
              )}
            </div>
          </div>

          {/* Project Image */}
          <div style={{ flex: '1', textAlign: 'center' }}>
            <div className="neumorphic-inset" style={{
              width: '400px',
              height: '300px',
              margin: '0 auto',
              backgroundImage: `url(${project.media.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 'var(--radius-md)'
            }} />
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      {project.media.gallery && project.media.gallery.length > 0 && (
        <section className="neumorphic-raised" style={{ 
          padding: 'var(--spacing-2xl)', 
          marginBottom: 'var(--spacing-xl)'
        }}>
          <h2 className="text-embossed" style={{ 
            fontSize: '2rem', 
            marginBottom: 'var(--spacing-xl)',
            textAlign: 'center'
          }}>
            Project Gallery
          </h2>

          {/* Main Image */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <div className="neumorphic-inset" style={{
              width: '100%',
              maxWidth: '800px',
              height: '400px',
              margin: '0 auto',
              backgroundImage: `url(${project.media.gallery[activeImage]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 'var(--radius-md)'
            }} />
          </div>

          {/* Thumbnail Navigation */}
          {project.media.gallery.length > 1 && (
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-md)', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {project.media.gallery.map((image, index) => (
                <button
                  key={index}
                  className={`btn ${activeImage === index ? 'neumorphic-inset' : 'neumorphic-raised'}`}
                  onClick={() => setActiveImage(index)}
                  style={{
                    width: '80px',
                    height: '60px',
                    padding: 0,
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 'var(--radius-sm)'
                  }}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Project Tags */}
      <section className="neumorphic-raised" style={{ 
        padding: 'var(--spacing-xl)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <h3 style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>Tags</h3>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 'var(--spacing-sm)',
          justifyContent: 'center'
        }}>
          {project.tags.map(tag => (
            <span key={tag} style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem'
            }}>
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <section style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        gap: 'var(--spacing-lg)'
      }}>
        <Link 
          to="/portfolio" 
          className="btn btn-pill"
          style={{ textDecoration: 'none', flex: '1', textAlign: 'center' }}
        >
          ← Back to Portfolio
        </Link>
        <Link 
          to="/contact" 
          className="btn btn-pill"
          style={{ textDecoration: 'none', flex: '1', textAlign: 'center' }}
        >
          Get in Touch →
        </Link>
      </section>
    </div>
  );
};

export default ProjectDetail; 