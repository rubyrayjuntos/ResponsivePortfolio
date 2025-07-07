import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjectThumbnail } from '../utils/imageUtils';

const ProjectCard = ({ project, layout, index = 0 }) => {
  const isMasonry = layout === 'masonry';

  // Get thumbnail using the new utility function
  const thumbnail = getProjectThumbnail(project);

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout
      style={{ width: '100%' }}
    >
      <Link 
        to={`/project/${project.slug}`} 
        className="neumorphic-raised" 
        style={{ 
          textDecoration: 'none',
          color: 'inherit',
          display: 'block',
          height: isMasonry ? 'auto' : 'clamp(350px, 50vh, 400px)',
          overflow: 'hidden',
          transition: 'all var(--transition-normal)',
          width: '100%'
        }}
      >
        {/* Project Image */}
        <motion.div 
          style={{
            width: '100%',
            height: isMasonry ? 'clamp(150px, 25vh, 200px)' : 'clamp(150px, 30vh, 200px)',
            backgroundImage: thumbnail ? `url(${thumbnail})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderTopLeftRadius: 'var(--radius-md)',
            borderTopRightRadius: 'var(--radius-md)',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: thumbnail ? 'transparent' : 'var(--bg-secondary)'
          }}
          variants={imageVariants}
        >
          {/* No Image Placeholder */}
          {!thumbnail && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-secondary)',
              fontSize: 'clamp(2rem, 5vw, 3rem)'
            }}>
              🖼️
            </div>
          )}

          {/* Highlight Badge */}
          {project.highlight && (
            <motion.div 
              style={{
                position: 'absolute',
                top: 'var(--spacing-sm)',
                right: 'var(--spacing-sm)',
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--bg-primary)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'clamp(0.6rem, 2vw, 0.8rem)',
                fontWeight: 'bold',
                zIndex: 2
              }}
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
            >
              ⭐ Featured
            </motion.div>
          )}

          {/* Status Badge */}
          {project.status && project.status !== 'completed' && (
            <motion.div 
              style={{
                position: 'absolute',
                top: 'var(--spacing-sm)',
                left: 'var(--spacing-sm)',
                backgroundColor: project.status === 'in-progress' ? '#FFA500' : '#FF6B6B',
                color: 'white',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'clamp(0.6rem, 2vw, 0.8rem)',
                fontWeight: 'bold',
                zIndex: 2
              }}
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
            >
              {project.status === 'in-progress' ? '🔄 In Progress' : '📋 Planned'}
            </motion.div>
          )}

          {/* Year Badge */}
          {project.year && (
            <motion.div 
              style={{
                position: 'absolute',
                bottom: 'var(--spacing-sm)',
                right: 'var(--spacing-sm)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'clamp(0.6rem, 2vw, 0.8rem)',
                zIndex: 2
              }}
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
            >
              {project.year}
            </motion.div>
          )}
        </motion.div>

        {/* Project Content */}
        <motion.div 
          style={{ 
            padding: 'var(--spacing-lg)',
            height: isMasonry ? 'auto' : 'clamp(150px, 20vh, 200px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Title and Subtitle */}
          <div>
            <h3 className="text-embossed" style={{ 
              fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
              marginBottom: 'var(--spacing-sm)',
              lineHeight: 1.3,
              wordBreak: 'break-word'
            }}>
              {project.title}
            </h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
              marginBottom: 'var(--spacing-md)',
              lineHeight: 1.4,
              wordBreak: 'break-word'
            }}>
              {project.subtitle}
            </p>
          </div>

          {/* Project Types */}
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-xs)', 
            flexWrap: 'wrap',
            marginBottom: 'var(--spacing-sm)'
          }}>
            {project.types.slice(0, 2).map((type) => (
              <span 
                key={type.id}
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--bg-primary)',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'clamp(0.6rem, 2vw, 0.7rem)',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
              >
                {type.name}
              </span>
            ))}
          </div>

          {/* Project Tags */}
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-xs)', 
            flexWrap: 'wrap'
          }}>
            {project.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag.id}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'clamp(0.6rem, 2vw, 0.7rem)',
                  whiteSpace: 'nowrap'
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard; 