import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const location = useLocation();
  const { currentTheme, changeTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const themes = [
    { id: 'default', name: 'Default' },
    { id: 'serene', name: 'Serene' },
    { id: 'playful', name: 'Playful' },
    { id: 'mystical', name: 'Mystical' },
    { id: 'professional', name: 'Professional' }
  ];

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  // Animation variants
  const navItemVariants = {
    hover: { 
      y: -2,
      transition: { duration: 0.2 }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="neumorphic-raised" style={{
        padding: 'var(--spacing-lg) var(--spacing-xl)',
        marginBottom: 'var(--spacing-xl)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(var(--bg-primary-rgb), 0.9)'
      }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo/Brand */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1 className="text-embossed text-2xl font-bold">
                Ray Swan
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                variants={navItemVariants}
                whileHover="hover"
              >
                <Link
                  to={item.path}
                  className={`text-lg font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-accent-primary'
                      : 'text-text-primary hover:text-accent-primary'
                  }`}
                  style={{ textDecoration: 'none' }}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Selector - Hidden on mobile to save space */}
            <select
              value={currentTheme}
              onChange={(e) => changeTheme(e.target.value)}
              className="hidden sm:block neumorphic-inset px-3 py-2 rounded-lg text-sm bg-transparent border-none outline-none focus:ring-2 focus:ring-accent-primary"
              style={{ color: 'var(--text-primary)' }}
            >
              {themes.map(theme => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden btn btn-pill p-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{
                  transform: isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 99,
                backdropFilter: 'blur(4px)'
              }}
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '280px',
                height: '100vh',
                backgroundColor: 'var(--bg-primary)',
                zIndex: 100,
                padding: 'var(--spacing-xl)',
                boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.3)',
                overflowY: 'auto'
              }}
            >
              {/* Mobile Menu Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 'var(--spacing-xl)',
                paddingBottom: 'var(--spacing-lg)',
                borderBottom: '1px solid var(--shadow-light)'
              }}>
                <h2 className="text-embossed text-xl">Menu</h2>
                <button 
                  className="btn btn-pill p-2"
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Navigation Items */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {navItems.map((item) => (
                  <motion.div
                    key={item.path}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`block py-3 px-4 rounded-lg transition-colors duration-200 ${
                        location.pathname === item.path
                          ? 'text-accent-primary neumorphic-inset'
                          : 'text-text-primary hover:text-accent-primary hover:neumorphic-inset'
                      }`}
                      style={{ textDecoration: 'none' }}
                    >
                      <span className="text-lg font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Theme Selector */}
              <div style={{ 
                marginTop: 'var(--spacing-xl)',
                paddingTop: 'var(--spacing-lg)',
                borderTop: '1px solid var(--shadow-light)'
              }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: 'var(--spacing-sm)',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)'
                }}>
                  Theme
                </label>
                <select
                  value={currentTheme}
                  onChange={(e) => changeTheme(e.target.value)}
                  className="neumorphic-inset px-3 py-2 rounded-lg text-sm bg-transparent border-none outline-none focus:ring-2 focus:ring-accent-primary w-full"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {themes.map(theme => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header; 