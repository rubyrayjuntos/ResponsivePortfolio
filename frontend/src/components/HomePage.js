import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFilter } from '../context/FilterContext';
import aboutData from '../data/about.json';
import projectsData from '../data/projects.json';

const HomePage = () => {
  const { filteredProjects } = useFilter();
  
  // Get featured project
  const featuredProject = projectsData.projects.find(project => project.highlight);

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
                    key={tag} 
                    className="neumorphic-inset" 
                    style={{
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      fontSize: '0.8rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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

            <motion.div 
              style={{ flex: '1', textAlign: 'center' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
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
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Quick Stats */}
      <motion.section 
        className="neumorphic-raised" 
        style={{ 
          padding: 'var(--spacing-xl)', 
          marginBottom: 'var(--spacing-2xl)'
        }}
        variants={itemVariants}
      >
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-lg)',
          textAlign: 'center'
        }}>
          {[
            { value: projectsData.projects.length, label: 'Projects' },
            { value: new Set(projectsData.projects.flatMap(p => p.tools)).size, label: 'Technologies' },
            { value: new Set(projectsData.projects.flatMap(p => p.type)).size, label: 'Categories' },
            { value: new Date().getFullYear() - 2020, label: 'Years Experience' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-embossed" style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>
                {stat.value}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
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
          Let's bring your ideas to life with innovative design and cutting-edge technology.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/contact" className="btn btn-pill" style={{ textDecoration: 'none' }}>
            Get In Touch
          </Link>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default HomePage; 