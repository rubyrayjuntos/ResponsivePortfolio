import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getProjectById } from '../utils/dataResolver';

const ProjectDetail = () => {
  const { slug } = useParams();
  const { changeTheme, resetTheme } = useTheme();
  const [project, setProject] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  // Find project by slug with resolved data
  useEffect(() => {
    const foundProject = getProjectById(slug);
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
        'cosmic elegance': 'professional'
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

  // Get thumbnail and gallery images
  const thumbnail = project.media?.thumbnail || 
                   (project.media && project.media.length > 0 ? project.media[0]?.path + project.media[0]?.filename : '');
  
  const galleryImages = project.media?.gallery || 
                       (project.media && project.media.length > 1 ? project.media.slice(1).map(m => m.path + m.filename) : []);

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
                <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--accent-primary)' }}>Status</h3>
                <span style={{
                  backgroundColor: project.status === 'completed' ? '#4CAF50' : 
                                 project.status === 'in-progress' ? '#FFA500' : '#FF6B6B',
                  color: 'white',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  textTransform: 'capitalize'
                }}>
                  {project.status}
                </span>
              </div>
              <div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--accent-primary)' }}>Difficulty</h3>
                <span style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  textTransform: 'capitalize'
                }}>
                  {project.difficulty}
                </span>
              </div>
            </div>

            {/* Project Types */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--accent-primary)' }}>Project Types</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                {project.types.map(type => (
                  <span key={type.id} style={{
                    backgroundColor: type.color || 'var(--accent-primary)',
                    color: 'white',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}>
                    {type.icon && <span>{type.icon}</span>}
                    {type.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools & Technologies */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--accent-primary)' }}>Tools & Technologies</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                {project.tools.map(tool => (
                  <span key={tool.id} style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem'
                  }}>
                    {tool.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Tags */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--accent-primary)' }}>Tags</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                {project.tags.map(tag => (
                  <span key={tag.id} style={{
                    backgroundColor: tag.color || 'var(--bg-secondary)',
                    color: 'white',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}>
                    {tag.icon && <span>{tag.icon}</span>}
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Links */}
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
              {project.links.map(link => (
                <a 
                  key={link.id}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-pill"
                  style={{ 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}
                >
                  {link.icon && <span>{link.icon}</span>}
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Project Image */}
          <div style={{ flex: '1', textAlign: 'center' }}>
            <div className="neumorphic-inset" style={{
              width: '400px',
              height: '300px',
              margin: '0 auto',
              backgroundImage: `url(${thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 'var(--radius-md)'
            }} />
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      {galleryImages && galleryImages.length > 0 && (
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
              backgroundImage: `url(${galleryImages[activeImage]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 'var(--radius-md)'
            }} />
          </div>

          {/* Thumbnail Navigation */}
          {galleryImages.length > 1 && (
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-sm)', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  style={{
                    width: '80px',
                    height: '60px',
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: index === activeImage ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)'
                  }}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default ProjectDetail; 