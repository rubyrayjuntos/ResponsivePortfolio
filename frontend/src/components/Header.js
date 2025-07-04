import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import aboutData from '../data/about.json';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentTheme, changeTheme, resetTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="neumorphic-raised" style={{ 
      margin: 'var(--spacing-lg)', 
      padding: 'var(--spacing-lg)',
      position: 'sticky',
      top: 'var(--spacing-lg)',
      zIndex: 1000
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo/Brand */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 className="text-embossed" style={{ 
            margin: 0, 
            fontSize: '1.5rem',
            fontFamily: 'var(--font-display)'
          }}>
            {aboutData.name}
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
          <Link 
            to="/" 
            className={`btn btn-pill ${isActive('/') ? 'neumorphic-inset' : ''}`}
            onClick={closeMenu}
            style={{ textDecoration: 'none' }}
          >
            HOME
          </Link>
          <Link 
            to="/portfolio" 
            className={`btn btn-pill ${isActive('/portfolio') ? 'neumorphic-inset' : ''}`}
            onClick={closeMenu}
            style={{ textDecoration: 'none' }}
          >
            PORTFOLIO
          </Link>
          <Link 
            to="/about" 
            className={`btn btn-pill ${isActive('/about') ? 'neumorphic-inset' : ''}`}
            onClick={closeMenu}
            style={{ textDecoration: 'none' }}
          >
            ABOUT
          </Link>
          <Link 
            to="/contact" 
            className={`btn btn-pill ${isActive('/contact') ? 'neumorphic-inset' : ''}`}
            onClick={closeMenu}
            style={{ textDecoration: 'none' }}
          >
            CONTACT
          </Link>

          {/* Theme Toggle */}
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button 
              className="btn btn-pill" 
              onClick={() => changeTheme('serene')}
              style={{ 
                fontSize: '0.8rem',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                opacity: currentTheme === 'serene' ? 1 : 0.6
              }}
            >
              🌿
            </button>
            <button 
              className="btn btn-pill" 
              onClick={() => changeTheme('playful')}
              style={{ 
                fontSize: '0.8rem',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                opacity: currentTheme === 'playful' ? 1 : 0.6
              }}
            >
              🎨
            </button>
            <button 
              className="btn btn-pill" 
              onClick={() => changeTheme('mystical')}
              style={{ 
                fontSize: '0.8rem',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                opacity: currentTheme === 'mystical' ? 1 : 0.6
              }}
            >
              ✨
            </button>
            <button 
              className="btn btn-pill" 
              onClick={resetTheme}
              style={{ 
                fontSize: '0.8rem',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                opacity: currentTheme === 'default' ? 1 : 0.6
              }}
            >
              🌙
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="btn btn-pill" 
          onClick={toggleMenu}
          style={{ 
            display: 'none',
            fontSize: '1.2rem',
            padding: 'var(--spacing-sm)',
            minWidth: 'auto'
          }}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'var(--spacing-md)', 
          marginTop: 'var(--spacing-lg)',
          paddingTop: 'var(--spacing-lg)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Link 
            to="/" 
            className={`btn btn-pill ${isActive('/') ? 'neumorphic-inset' : ''}`}
            onClick={closeMenu}
            style={{ textDecoration: 'none', textAlign: 'center' }}
          >
            HOME
          </Link>
          <Link 
            to="/portfolio" 
            className={`btn btn-pill ${isActive('/portfolio') ? 'neumorphic-inset' : ''}`}
            onClick={closeMenu}
            style={{ textDecoration: 'none', textAlign: 'center' }}
          >
            PORTFOLIO
          </Link>
          <Link 
            to="/about" 
            className={`btn btn-pill ${isActive('/about') ? 'neumorphic-inset' : ''}`}
            onClick={closeMenu}
            style={{ textDecoration: 'none', textAlign: 'center' }}
          >
            ABOUT
          </Link>
          <Link 
            to="/contact" 
            className={`btn btn-pill ${isActive('/contact') ? 'neumorphic-inset' : ''}`}
            onClick={closeMenu}
            style={{ textDecoration: 'none', textAlign: 'center' }}
          >
            CONTACT
          </Link>

          {/* Mobile Theme Toggle */}
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-sm)', 
            justifyContent: 'center',
            marginTop: 'var(--spacing-md)'
          }}>
            <button 
              className="btn btn-pill" 
              onClick={() => changeTheme('serene')}
              style={{ 
                fontSize: '1rem',
                padding: 'var(--spacing-sm)',
                opacity: currentTheme === 'serene' ? 1 : 0.6
              }}
            >
              🌿
            </button>
            <button 
              className="btn btn-pill" 
              onClick={() => changeTheme('playful')}
              style={{ 
                fontSize: '1rem',
                padding: 'var(--spacing-sm)',
                opacity: currentTheme === 'playful' ? 1 : 0.6
              }}
            >
              🎨
            </button>
            <button 
              className="btn btn-pill" 
              onClick={() => changeTheme('mystical')}
              style={{ 
                fontSize: '1rem',
                padding: 'var(--spacing-sm)',
                opacity: currentTheme === 'mystical' ? 1 : 0.6
              }}
            >
              ✨
            </button>
            <button 
              className="btn btn-pill" 
              onClick={resetTheme}
              style={{ 
                fontSize: '1rem',
                padding: 'var(--spacing-sm)',
                opacity: currentTheme === 'default' ? 1 : 0.6
              }}
            >
              🌙
            </button>
          </div>
        </nav>
      )}

      {/* Responsive Design */}
      <style jsx>{`
        @media (max-width: 768px) {
          nav {
            display: none;
          }
          
          button[onClick="${toggleMenu}"] {
            display: block !important;
          }
        }
        
        @media (min-width: 769px) {
          button[onClick="${toggleMenu}"] {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header; 