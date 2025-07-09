import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjectById } from '../utils/dataResolver';
import { getProjectThumbnail, getProjectGallery } from '../utils/imageUtils';
import MarkdownModal from './MarkdownModal';
import { getPrimaryCategoryTag } from '../utils/categoryMapper';

const CATEGORY_BORDER_VAR = {
  art: '--border-art',
  code: '--border-code',
  writing: '--border-writing',
};
const CATEGORY_GLOW_VAR = {
  art: '--glow-art',
  code: '--glow-code',
  writing: '--glow-writing',
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [modalState, setModalState] = useState({
    isOpen: false,
    documentUrl: null,
    title: ''
  });

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const projectData = await getProjectById(slug);
        setProject(projectData);
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 'var(--spacing-2xl)' }}>
        <div className="neumorphic-raised" style={{ 
          padding: 'var(--spacing-2xl)', 
          textAlign: 'center'
        }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p style={{ marginTop: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container" style={{ paddingTop: 'var(--spacing-2xl)' }}>
        <div className="neumorphic-raised" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
          <h1>Project Not Found</h1>
          <p>Sorry, the project you're looking for doesn't exist.</p>
          <Link to="/portfolio" className="btn btn-pill" style={{ textDecoration: 'none' }}>
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const thumbnail = getProjectThumbnail(project);
  const galleryImages = getProjectGallery(project);
  const primaryCategory = getPrimaryCategoryTag(project);
  const borderColor = primaryCategory ? `var(${CATEGORY_BORDER_VAR[primaryCategory]})` : 'transparent';
  const boxShadow = primaryCategory ? `0 0 0 3px var(${CATEGORY_BORDER_VAR[primaryCategory]}), var(${CATEGORY_GLOW_VAR[primaryCategory]})` : undefined;

  // Modal handlers
  const openDocumentModal = (documentUrl, title) => {
    setModalState({
      isOpen: true,
      documentUrl,
      title
    });
  };

  const closeDocumentModal = () => {
    setModalState({
      isOpen: false,
      documentUrl: null,
      title: ''
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="container" 
      style={{ paddingTop: 'var(--spacing-2xl)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Project Header */}
      <motion.section 
        className="neumorphic-raised" 
        style={{ 
          padding: 'var(--spacing-2xl)', 
          marginBottom: 'var(--spacing-2xl)',
          border: `3px solid ${borderColor}`,
          boxShadow,
          borderRadius: 'var(--radius-md)',
          transition: 'box-shadow 0.3s, border-color 0.3s',
        }}
        whileHover={{
          boxShadow: primaryCategory
            ? `0 0 0 3px var(${CATEGORY_BORDER_VAR[primaryCategory]}), 0 0 24px var(${CATEGORY_BORDER_VAR[primaryCategory]})`
            : undefined,
        }}
        variants={itemVariants}
      >
        <div style={{ display: 'flex', gap: 'var(--spacing-2xl)', alignItems: 'flex-start' }}>
          {/* Project Info */}
          <motion.div style={{ flex: '2' }} variants={itemVariants}>
            <h1 className="text-embossed" style={{ 
              fontSize: '2.5rem', 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--text-primary)'
            }}>
              {project.title}
            </h1>
            
            <h2 style={{ 
              fontSize: '1.5rem', 
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--accent-primary)'
            }}>
              {project.subtitle}
            </h2>
            
            <p style={{ 
              fontSize: '1.1rem', 
              marginBottom: 'var(--spacing-xl)',
              lineHeight: 1.6,
              color: 'var(--text-secondary)'
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
              {project.year && (
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-secondary)' }}>
                    Year
                  </h3>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{project.year}</p>
                </div>
              )}
              
              {project.status && (
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-secondary)' }}>
                    Status
                  </h3>
                  <p style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 'bold',
                    color: project.status === 'completed' ? '#4CAF50' : 
                           project.status === 'in-progress' ? '#FFA500' : '#FF6B6B'
                  }}>
                    {project.status === 'completed' ? '✅ Completed' :
                     project.status === 'in-progress' ? '🔄 In Progress' : '📋 Planned'}
                  </p>
                </div>
              )}
            </div>

            {/* Project Types */}
            {project.types && project.types.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-sm)' }}>Categories</h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                  {project.types.map(type => (
                    <span
                      key={type.id}
                      style={{
                        backgroundColor: type.color || 'var(--accent-primary)',
                        color: 'white',
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)'
                      }}
                    >
                      {type.icon && <span>{type.icon}</span>}
                      {type.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Tools */}
            {project.tools && project.tools.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-sm)' }}>Tools & Technologies</h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                  {project.tools.map(tool => (
                    <span
                      key={tool.id}
                      style={{
                        backgroundColor: tool.color || 'var(--accent-secondary)',
                        color: 'white',
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)'
                      }}
                    >
                      {tool.icon && <span>{tool.icon}</span>}
                      {tool.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Tags */}
            {project.tags && project.tags.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-sm)' }}>Tags</h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                  {project.tags.map(tag => (
                    <span
                      key={tag.id}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)'
                      }}
                    >
                      {tag.icon && <span>{tag.icon}</span>}
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Links */}
            {project.links && project.links.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-sm)' }}>Links</h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                  {project.links.map(link => {
                    // Handle document links differently
                    if (link.type === 'document') {
                      return (
                        <button
                          key={link.id}
                          onClick={() => openDocumentModal(link.url, link.label)}
                          className="btn btn-pill"
                          style={{ 
                            textDecoration: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-xs)'
                          }}
                        >
                          {link.icon && <span>{link.icon}</span>}
                          {link.label}
                        </button>
                      );
                    }
                    
                    // Handle regular links
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-pill"
                        style={{ textDecoration: 'none' }}
                      >
                        {link.icon && <span>{link.icon}</span>}
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* Project Thumbnail */}
          <motion.div 
            style={{ flex: '1', textAlign: 'center' }}
            variants={itemVariants}
          >
            <div className="neumorphic-inset" style={{
              width: '400px',
              height: '300px',
              margin: '0 auto',
              backgroundImage: `url(${thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 'var(--radius-md)'
            }} />
          </motion.div>
        </div>
      </motion.section>

      {/* Project Gallery */}
      {galleryImages.length > 0 && (
        <motion.section 
          className="neumorphic-raised" 
          style={{ 
            padding: 'var(--spacing-2xl)', 
            marginBottom: 'var(--spacing-2xl)'
          }}
          variants={itemVariants}
        >
          <h2 className="text-embossed" style={{ 
            fontSize: '2rem', 
            marginBottom: 'var(--spacing-xl)',
            textAlign: 'center'
          }}>
            Gallery
          </h2>
          
          {/* Main Image */}
          <motion.div 
            style={{ 
              width: '100%', 
              height: '500px', 
              marginBottom: 'var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative'
            }}
            variants={imageVariants}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${galleryImages[activeImage]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </motion.div>

          {/* Thumbnail Navigation */}
          {galleryImages.length > 1 && (
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-sm)', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  style={{
                    width: '80px',
                    height: '60px',
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    border: index === activeImage ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setActiveImage(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>
          )}
        </motion.section>
      )}

      {/* Navigation */}
      <motion.div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: 'var(--spacing-2xl)'
        }}
        variants={itemVariants}
      >
        <Link to="/portfolio" className="btn btn-pill" style={{ textDecoration: 'none' }}>
          ← Back to Portfolio
        </Link>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <Link to="/contact" className="btn btn-pill" style={{ textDecoration: 'none' }}>
            Get in Touch
          </Link>
          <Link to="/about" className="btn btn-pill" style={{ textDecoration: 'none' }}>
            About Me
          </Link>
        </div>
      </motion.div>

      {/* Markdown Modal */}
      <MarkdownModal
        isOpen={modalState.isOpen}
        onClose={closeDocumentModal}
        documentUrl={modalState.documentUrl}
        title={modalState.title}
      />
    </motion.div>
  );
};

export default ProjectDetail; 