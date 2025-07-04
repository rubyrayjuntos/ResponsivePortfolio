import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const location = useLocation();
  const { currentTheme, changeTheme } = useTheme();

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

  return (
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

        {/* Navigation */}
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

        {/* Theme Selector */}
        <div className="flex items-center space-x-4">
          <select
            value={currentTheme}
            onChange={(e) => changeTheme(e.target.value)}
            className="neumorphic-inset px-3 py-2 rounded-lg text-sm bg-transparent border-none outline-none focus:ring-2 focus:ring-accent-primary"
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
            onClick={() => {
              // Mobile menu toggle logic would go here
              console.log('Mobile menu toggle');
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {/* This would be implemented for mobile menu */}
    </header>
  );
};

export default Header; 