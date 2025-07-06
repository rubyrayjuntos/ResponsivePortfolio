import React from 'react';
import ProjectCarousel from './ProjectCarousel';
import '../styles/carouselDemo.css';

const CarouselDemo = () => {
  return (
    <div className="carousel-demo">
      <div className="demo-header">
        <h1>Project Carousel Demo</h1>
        <p>Showcasing the neumorphic carousel component with different configurations</p>
      </div>

      <section className="demo-section">
        <h2>Default Carousel</h2>
        <p>Basic carousel with all features enabled</p>
        <ProjectCarousel 
          maxProjects={4}
          autoPlay={true}
          autoPlayInterval={4000}
        />
      </section>

      <section className="demo-section">
        <h2>Game Projects Only</h2>
        <p>Filtered to show only game-related projects</p>
        <ProjectCarousel 
          filterByType="game-design"
          maxProjects={3}
          autoPlay={false}
        />
      </section>

      <section className="demo-section">
        <h2>Creative Technology Projects</h2>
        <p>Focusing on creative technology and AI projects</p>
        <ProjectCarousel 
          filterByType="creative-technology"
          maxProjects={4}
          autoPlay={true}
          autoPlayInterval={6000}
        />
      </section>

      <section className="demo-section">
        <h2>Compact View</h2>
        <p>Carousel with slider disabled for a cleaner look</p>
        <ProjectCarousel 
          maxProjects={6}
          showSlider={false}
          autoPlay={false}
        />
      </section>
    </div>
  );
};

export default CarouselDemo; 