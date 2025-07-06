import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/neumorphic.css';

// Components
import Header from './components/Header';
import HomePage from './components/HomePage';
import PortfolioPage from './components/PortfolioPage';
import ProjectDetail from './components/ProjectDetail';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import DataManager from './components/DataManager';
import CarouselDemo from './components/CarouselDemo';

// Context
import { ThemeProvider } from './context/ThemeContext';
import { FilterProvider } from './context/FilterContext';

// Page transition component
const PageTransition = ({ children }) => {
  const location = useLocation();
  
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <FilterProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="App">
            <Header />
            <main>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={
                    <PageTransition>
                      <HomePage />
                    </PageTransition>
                  } />
                  <Route path="/portfolio" element={
                    <PageTransition>
                      <PortfolioPage />
                    </PageTransition>
                  } />
                  <Route path="/portfolio/:category" element={
                    <PageTransition>
                      <PortfolioPage />
                    </PageTransition>
                  } />
                  <Route path="/project/:slug" element={
                    <PageTransition>
                      <ProjectDetail />
                    </PageTransition>
                  } />
                  <Route path="/about" element={
                    <PageTransition>
                      <AboutPage />
                    </PageTransition>
                  } />
                  <Route path="/contact" element={
                    <PageTransition>
                      <ContactPage />
                    </PageTransition>
                  } />
                  <Route path="/admin/data" element={
                    <PageTransition>
                      <DataManager />
                    </PageTransition>
                  } />
                  <Route path="/demo/carousel" element={
                    <PageTransition>
                      <CarouselDemo />
                    </PageTransition>
                  } />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </Router>
      </FilterProvider>
    </ThemeProvider>
  );
}

export default App; 