import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/neumorphic.css';

// Components
import Header from './components/Header';
import HomePage from './components/HomePage';
import PortfolioPage from './components/PortfolioPage';
import ProjectDetail from './components/ProjectDetail';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';

// Context
import { ThemeProvider } from './context/ThemeContext';
import { FilterProvider } from './context/FilterContext';

function App() {
  const [currentTheme, setCurrentTheme] = useState('default');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeProvider initialValue={{ currentTheme, setCurrentTheme }}>
      <FilterProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/portfolio/:category" element={<PortfolioPage />} />
                <Route path="/project/:slug" element={<ProjectDetail />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </FilterProvider>
    </ThemeProvider>
  );
}

export default App; 