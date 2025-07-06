import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import projectsData from '../data/projects.json';
import mediaData from '../data/media.json';
import typesData from '../data/types.json';
import VanillaTilt from 'vanilla-tilt';
import '../styles/projectCarousel.css';

const ProjectCarousel = ({ 
  filterByType = null, 
  maxProjects = 6, 
  showSlider = true,
  autoPlay = false,
  autoPlayInterval = 5000 
}) => {
  // const { currentTheme } = useTheme(); // Unused for now, but available for future theme customization
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Filter and prepare projects
  const filteredProjects = projectsData.projects
    .filter(project => !filterByType || project.typeIds.includes(filterByType))
    .slice(0, maxProjects);

  // Get project images and types
  const getProjectImage = (project) => {
    if (project.mediaIds && project.mediaIds.length > 0) {
      const mediaItem = mediaData.media.find(m => m.id === project.mediaIds[0]);
      if (mediaItem) {
        return `${mediaItem.path}${mediaItem.filename}`;
      }
    }
    return '/src/assets/images/placeholder.jpg';
  };

  const getProjectTypes = (project) => {
    return project.typeIds
      .map(typeId => {
        const type = typesData.types.find(t => t.id === typeId);
        return type ? type.name : typeId;
      })
      .slice(0, 2); // Show max 2 types
  };

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % filteredProjects.length);
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, isAutoPlaying, autoPlayInterval, filteredProjects.length]);

  // Scroll to current index
  const scrollToIndex = useCallback((index) => {
    if (carouselRef.current) {
      const cardWidth = 320; // card width + gap
      const scrollPosition = index * cardWidth;
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
    setCurrentIndex(index);
  }, []);

  // Handle scroll events to update current index
  const handleScroll = useCallback(() => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const cardWidth = 320;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  }, []);

  // Navigation functions
  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % filteredProjects.length;
    scrollToIndex(nextIndex);
  };

  const goToPrev = () => {
    const prevIndex = currentIndex === 0 ? filteredProjects.length - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  };

  // Toggle auto-play
  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Calculate slider position
  const sliderPosition = (currentIndex / (filteredProjects.length - 1)) * 100;

  // Initialize VanillaTilt
  useEffect(() => {
    const cards = document.querySelectorAll('.project-card');
    VanillaTilt.init(cards, {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.2
    });

    return () => {
      cards.forEach(card => {
        if (card.vanillaTilt) {
          card.vanillaTilt.destroy();
        }
      });
    };
  }, [filteredProjects]);

  return (
    <div className="project-carousel-container">
      <div className="carousel-header">
        <h2 className="carousel-title">Featured Projects</h2>
        {autoPlay && (
          <button 
            className={`auto-play-btn ${isAutoPlaying ? 'playing' : ''}`}
            onClick={toggleAutoPlay}
            aria-label={isAutoPlaying ? 'Pause auto-play' : 'Start auto-play'}
          >
            <span className="auto-play-icon">
              {isAutoPlaying ? '⏸' : '▶'}
            </span>
          </button>
        )}
      </div>

      <div className="carousel-wrapper">
        <button 
          className="carousel-nav-btn prev-btn"
          onClick={goToPrev}
          aria-label="Previous project"
        >
          <span>‹</span>
        </button>

        <div 
          className="project-carousel" 
          ref={carouselRef}
          onScroll={handleScroll}
        >
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id}
              className={`project-card ${index === currentIndex ? 'active' : ''}`}
              data-tilt
              data-tilt-max="10"
              data-tilt-speed="400"
              data-tilt-glare="true"
              data-tilt-max-glare="0.2"
            >
              <div className="card-image-container">
                <img 
                  src={getProjectImage(project)} 
                  alt={project.title}
                  className="card-image"
                  loading="lazy"
                />
                <div className="card-overlay">
                  <div className="project-types">
                    {getProjectTypes(project).map((type, typeIndex) => (
                      <span key={typeIndex} className="type-badge">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-subtitle">{project.subtitle}</p>
                <p className="project-description">{project.description}</p>
                
                <div className="card-footer">
                  <div className="project-meta">
                    <span className="project-year">{project.year}</span>
                    <span className="project-status">{project.status}</span>
                  </div>
                  <button className="explore-btn">
                    Explore Project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="carousel-nav-btn next-btn"
          onClick={goToNext}
          aria-label="Next project"
        >
          <span>›</span>
        </button>
      </div>

      {showSlider && filteredProjects.length > 1 && (
        <div className="carousel-controls">
          <div className="slider-track">
            <div 
              className="slider-thumb"
              style={{ transform: `translateX(${sliderPosition}%)` }}
            />
          </div>
          
          <div className="slider-dots">
            {filteredProjects.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCarousel; 