import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProjectCard = ({ project, layout, index = 0 }) => {
  const isMasonry = layout === 'masonry';

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
    >
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
        <motion.div 
          style={{
            width: '100%',
            height: isMasonry ? '200px' : '200px',
            backgroundImage: `url(${project.media.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderTopLeftRadius: 'var(--radius-md)',
            borderTopRightRadius: 'var(--radius-md)',
            position: 'relative',
            overflow: 'hidden'
          }}
          variants={imageVariants}
        >
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
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
            >
              ⭐ Featured
            </motion.div>
          )}

          {/* Year Badge */}
          <motion.div 
            style={{
              position: 'absolute',
              bottom: 'var(--spacing-sm)',
              left: 'var(--spacing-sm)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem'
            }}
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
          >
            {project.year}
          </motion.div>
        </motion.div>

        {/* Project Content */}
        <motion.div 
          style={{ 
            padding: 'var(--spacing-lg)',
            height: isMasonry ? 'auto' : '200px',
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
          <motion.div 
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 'var(--spacing-xs)',
              marginBottom: 'var(--spacing-md)'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {project.tags.slice(0, 3).map((tag, tagIndex) => (
              <motion.span 
                key={tag} 
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.7rem'
                }}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + tagIndex * 0.1 }}
              >
                {tag}
              </motion.span>
            ))}
            {project.tags.length > 3 && (
              <motion.span 
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.7rem'
                }}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                +{project.tags.length - 3}
              </motion.span>
            )}
          </motion.div>

          {/* Project Type */}
          <motion.div 
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 'var(--spacing-xs)',
              marginTop: 'auto'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {project.type.slice(0, 2).map((type, typeIndex) => (
              <motion.span 
                key={type} 
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--bg-primary)',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + typeIndex * 0.1 }}
              >
                {type}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard; 