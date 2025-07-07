import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllProjects } from '../utils/dataResolver';
import { getProjectThumbnail } from '../utils/imageUtils';
import aboutData from '../data/about.json';

const HomePage = () => {
  // Get featured project with resolved data
  const allProjects = getAllProjects();
  const featuredProject = allProjects.find(project => project.highlight);

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
        <motion.div 
          style={{ 
            display: 'flex', 
            gap: 'var(--spacing-lg)', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
          variants={containerVariants}
        >
          {[
            { text: 'CODE', subtitle: 'Development', delay: 0.8 },
            { text: 'ART', subtitle: 'Creative', delay: 0.9 },
            { text: 'WRITE', subtitle: 'Narrative', delay: 1.0 }
          ].map((item, index) => (
            <motion.div
              key={item.text}
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: item.delay }}
            >
              <Link to="/portfolio" className="btn btn-circular" style={{ textDecoration: 'none' }}>
                <motion.span 
                  style={{ 
                    fontSize: 'clamp(0.8rem, 2.5vw, 1.2rem)', 
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.text}
                </motion.span>
                <span style={{ 
                  fontSize: 'clamp(0.6rem, 2vw, 0.8rem)', 
                  opacity: 0.7,
                  textAlign: 'center'
                }}>
                  {item.subtitle}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
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