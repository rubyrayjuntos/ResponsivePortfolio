import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, layout }) => {
  const isMasonry = layout === 'masonry';

  return (
    <Link 
      to={`/project/${project.slug}`} 
      className="neumorphic-raised" 
      style={{ 
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        height: isMasonry ? 'auto' : '400px',
        overflow: 'hidden',
        transition: 'all var(--transition-normal)'
      }}
    >
      {/* Project Image */}
      <div style={{
        width: '100%',
        height: isMasonry ? '200px' : '200px',
        backgroundImage: `url(${project.media.thumbnail})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderTopLeftRadius: 'var(--radius-md)',
        borderTopRightRadius: 'var(--radius-md)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Highlight Badge */}
        {project.highlight && (
          <div style={{
            position: 'absolute',
            top: 'var(--spacing-sm)',
            right: 'var(--spacing-sm)',
            backgroundColor: 'var(--accent-primary)',
            color: 'var(--bg-primary)',
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>
            ⭐ Featured
          </div>
        )}

        {/* Year Badge */}
        <div style={{
          position: 'absolute',
          bottom: 'var(--spacing-sm)',
          left: 'var(--spacing-sm)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem'
        }}>
          {project.year}
        </div>
      </div>

      {/* Project Content */}
      <div style={{ 
        padding: 'var(--spacing-lg)',
        height: isMasonry ? 'auto' : '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Title and Subtitle */}
        <div>
          <h3 className="text-embossed" style={{ 
            fontSize: '1.2rem', 
            marginBottom: 'var(--spacing-sm)',
            lineHeight: 1.3
          }}>
            {project.title}
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.9rem',
            marginBottom: 'var(--spacing-md)',
            lineHeight: 1.4
          }}>
            {project.subtitle}
          </p>
        </div>

        {/* Description (truncated for grid layout) */}
        {!isMasonry && (
          <p style={{ 
            fontSize: '0.9rem',
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            marginBottom: 'var(--spacing-md)'
          }}>
            {project.description}
          </p>
        )}

        {/* Project Tags */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 'var(--spacing-xs)',
          marginBottom: 'var(--spacing-md)'
        }}>
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.7rem'
            }}>
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.7rem'
            }}>
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Project Type */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 'var(--spacing-xs)',
          marginTop: 'auto'
        }}>
          {project.type.slice(0, 2).map(type => (
            <span key={type} style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--bg-primary)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }}>
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Hover Effect */}
      <style jsx>{`
        .neumorphic-raised:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 
            -8px -8px 16px var(--shadow-light),
            8px 8px 16px var(--shadow-dark);
        }
      `}</style>
    </Link>
  );
};

export default ProjectCard; 