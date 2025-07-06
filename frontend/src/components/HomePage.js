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
            fontSize: '3rem', 
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
            fontSize: '1.5rem', 
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
            fontSize: '1.1rem', 
            marginBottom: 'var(--spacing-2xl)',
            maxWidth: '800px',
            margin: '0 auto var(--spacing-2xl)',
            color: 'var(--text-secondary)'
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
            flexWrap: 'wrap'
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
                  style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.text}
                </motion.span>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{item.subtitle}</span>
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
          <div style={{ display: 'flex', gap: 'var(--spacing-2xl)', alignItems: 'center' }}>
            <motion.div 
              style={{ flex: '1' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
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
                    style={{
                      backgroundColor: type.color || 'var(--accent-primary)',
                      color: 'white',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)'
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  >
                    {type.icon && <span>{type.icon}</span>}
                    {type.label}
                  </motion.span>
                ))}
              </motion.div>

              {/* Project Tags */}
              <motion.div 
                style={{ 
                  display: 'flex', 
                  gap: 'var(--spacing-sm)', 
                  flexWrap: 'wrap',
                  marginBottom: 'var(--spacing-lg)'
                }}
                variants={containerVariants}
              >
                {featuredProject.tags.slice(0, 3).map((tag, index) => (
                  <motion.span 
                    key={tag.id}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)'
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    {tag.icon && <span>{tag.icon}</span>}
                    {tag.label}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div 
                style={{ display: 'flex', gap: 'var(--spacing-md)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <Link 
                  to={`/project/${featuredProject.slug}`}
                  className="btn btn-pill"
                  style={{ textDecoration: 'none' }}
                >
                  View Project
                </Link>
                <Link 
                  to="/portfolio"
                  className="btn btn-pill"
                  style={{ textDecoration: 'none' }}
                >
                  View All Projects
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              style={{ flex: '1', textAlign: 'center' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="neumorphic-inset" style={{
                width: '400px',
                height: '300px',
                margin: '0 auto',
                backgroundImage: `url(${getProjectThumbnail(featuredProject)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 'var(--radius-md)'
              }} />
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Recent Projects */}
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
          Recent Projects
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-lg)'
        }}>
          {allProjects.slice(0, 3).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link 
                to={`/project/${project.slug}`}
                className="neumorphic-raised" 
                style={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  padding: 'var(--spacing-lg)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-normal)'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '150px',
                  backgroundImage: `url(${getProjectThumbnail(project)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 'var(--spacing-md)'
                }} />
                
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: 'var(--spacing-sm)',
                  color: 'var(--text-primary)'
                }}>
                  {project.title}
                </h3>
                
                <p style={{ 
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--spacing-md)',
                  lineHeight: 1.4
                }}>
                  {project.subtitle}
                </p>

                <div style={{ 
                  display: 'flex', 
                  gap: 'var(--spacing-xs)', 
                  flexWrap: 'wrap'
                }}>
                  {project.types.slice(0, 1).map(type => (
                    <span key={type.id} style={{
                      backgroundColor: type.color || 'var(--accent-primary)',
                      color: 'white',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)'
                    }}>
                      {type.icon && <span>{type.icon}</span>}
                      {type.label}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link 
            to="/portfolio"
            className="btn btn-pill"
            style={{ textDecoration: 'none' }}
          >
            View All Projects
          </Link>
        </motion.div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        className="neumorphic-raised" 
        style={{ 
          padding: 'var(--spacing-2xl)', 
          textAlign: 'center'
        }}
        variants={itemVariants}
      >
        <h2 className="text-embossed" style={{ 
          fontSize: '2rem', 
          marginBottom: 'var(--spacing-lg)'
        }}>
          Ready to Collaborate?
        </h2>
        <p style={{ 
          fontSize: '1.1rem', 
          marginBottom: 'var(--spacing-xl)',
          color: 'var(--text-secondary)'
        }}>
          Let's create something amazing together.
        </p>
        <motion.div 
          style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link 
                to="/contact"
                className="btn btn-pill"
                style={{ textDecoration: 'none' }}
              >
                Get in Touch
              </Link>
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link 
                to="/about"
                className="btn btn-pill"
                style={{ textDecoration: 'none' }}
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default HomePage; 