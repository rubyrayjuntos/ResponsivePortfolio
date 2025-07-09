import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllProjectsAsync } from '../utils/dataResolver';
import { getProjectThumbnail } from '../utils/imageUtils';
import { getAllCategories, getCategoryStatsDirect } from '../utils/categoryMapper';
import aboutData from '../data/about.json';

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

const CATEGORY_IDS = ['art', 'code', 'writing'];

const HomePage = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Get featured project with resolved data
  const featuredProject = allProjects.find(project => project.highlight);
  
  // Get category statistics using direct category field
  const categoryStats = getCategoryStatsDirect(allProjects);
  const categories = getAllCategories();

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
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

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="container" 
      style={{ paddingTop: 'var(--spacing-2xl)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section 
        className="neumorphic-raised" 
        style={{ 
          padding: 'var(--spacing-2xl)', 
          marginBottom: 'var(--spacing-2xl)',
          textAlign: 'center'
        }}
        variants={itemVariants}
      >
        <motion.h1 
          className="text-embossed" 
          style={{ 
            fontSize: 'clamp(2rem, 6vw, 3rem)', 
            marginBottom: 'var(--spacing-lg)',
            fontFamily: 'var(--font-display)'
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {aboutData.name}
        </motion.h1>
        <motion.p 
          className="text-engraved" 
          style={{ 
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', 
            marginBottom: 'var(--spacing-xl)',
            maxWidth: '600px',
            margin: '0 auto var(--spacing-xl)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {aboutData.headline}
        </motion.p>
        <motion.p 
          style={{ 
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', 
            marginBottom: 'var(--spacing-2xl)',
            maxWidth: '800px',
            margin: '0 auto var(--spacing-2xl)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {aboutData.bio}
        </motion.p>

        {/* Category Navigation */}
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          {CATEGORY_IDS.map(categoryId => (
            <motion.div
              key={categoryId}
              whileHover={{
                boxShadow: `0 0 0 3px var(${CATEGORY_BORDER_VAR[categoryId]}), 0 0 24px var(${CATEGORY_BORDER_VAR[categoryId]})`,
              }}
              style={{
                border: `3px solid var(${CATEGORY_BORDER_VAR[categoryId]})`,
                boxShadow: `0 0 0 3px var(${CATEGORY_BORDER_VAR[categoryId]}), var(${CATEGORY_GLOW_VAR[categoryId]})`,
                borderRadius: 'var(--radius-full)',
                transition: 'box-shadow 0.3s, border-color 0.3s',
                display: 'inline-block',
              }}
            >
              <Link
                to={`/portfolio/${categoryId}`}
                className="btn btn-circular"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  width: '120px',
                  height: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--bg-primary)',
                }}
              >
                {categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Project */}
      {featuredProject && (
        <motion.section 
          className="neumorphic-raised" 
          style={{ 
            padding: 'var(--spacing-2xl)', 
            marginBottom: 'var(--spacing-2xl)'
          }}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-2xl)', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <motion.div 
              style={{ flex: '1', minWidth: '300px' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-embossed" style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                marginBottom: 'var(--spacing-md)'
              }}>
                Featured Project
              </h2>
              <h3 style={{ 
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--accent-primary)'
              }}>
                {featuredProject.title}
              </h3>
              <p style={{ 
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', 
                marginBottom: 'var(--spacing-md)',
                color: 'var(--text-secondary)'
              }}>
                {featuredProject.subtitle}
              </p>
              <p style={{ 
                marginBottom: 'var(--spacing-lg)',
                lineHeight: 1.6,
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
              }}>
                {featuredProject.description}
              </p>
              
              {/* Project Types */}
              <motion.div 
                style={{ 
                  display: 'flex', 
                  gap: 'var(--spacing-sm)', 
                  flexWrap: 'wrap',
                  marginBottom: 'var(--spacing-lg)'
                }}
                variants={containerVariants}
              >
                {featuredProject.types.slice(0, 2).map((type, index) => (
                  <motion.span 
                    key={type.id}
                    variants={itemVariants}
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--bg-primary)',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                      fontWeight: 'bold'
                    }}
                  >
                    {type.name}
                  </motion.span>
                ))}
              </motion.div>
              
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Link 
                  to={`/project/${featuredProject.slug}`}
                  className="btn btn-pill"
                  style={{ textDecoration: 'none' }}
                >
                  View Project
                </Link>
              </motion.div>
            </motion.div>

            {/* Featured Project Image */}
            <motion.div 
              style={{ 
                flex: '1', 
                minWidth: '300px',
                maxWidth: '500px'
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {getProjectThumbnail(featuredProject) ? (
                <div style={{
                  width: '100%',
                  height: '300px',
                  backgroundImage: `url(${getProjectThumbnail(featuredProject)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }} />
              ) : (
                <div style={{
                  width: '100%',
                  height: '300px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '3rem'
                }}>
                  🖼️
                </div>
              )}
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Quick Stats */}
      <motion.section 
        className="neumorphic-raised" 
        style={{ 
          padding: 'var(--spacing-2xl)', 
          marginBottom: 'var(--spacing-2xl)'
        }}
        variants={itemVariants}
      >
        <h2 className="text-embossed" style={{ 
          fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
          marginBottom: 'var(--spacing-xl)',
          textAlign: 'center'
        }}>
          Quick Stats
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-xl)'
        }}>
          <motion.div 
            className="neumorphic-inset" 
            style={{ 
              padding: 'var(--spacing-lg)',
              textAlign: 'center'
            }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: 'bold',
              color: 'var(--accent-primary)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              {allProjects.length}
            </div>
            <div style={{ 
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              color: 'var(--text-secondary)'
            }}>
              Projects Completed
            </div>
          </motion.div>
          
          <motion.div 
            className="neumorphic-inset" 
            style={{ 
              padding: 'var(--spacing-lg)',
              textAlign: 'center'
            }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: 'bold',
              color: 'var(--accent-primary)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              5+
            </div>
            <div style={{ 
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              color: 'var(--text-secondary)'
            }}>
              Years Experience
            </div>
          </motion.div>
          
          <motion.div 
            className="neumorphic-inset" 
            style={{ 
              padding: 'var(--spacing-lg)',
              textAlign: 'center'
            }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: 'bold',
              color: 'var(--accent-primary)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              3
            </div>
            <div style={{ 
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              color: 'var(--text-secondary)'
            }}>
              Creative Disciplines
            </div>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default HomePage; 