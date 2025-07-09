import React from 'react';
import aboutData from '../data/about.json';
import { getAllSkills, getSkillsByCategory } from '../utils/dataResolver';

const AboutPage = () => {
  // Get all skills and group them by category
  const skillCategories = [
    'Frontend Development',
    'Backend Development', 
    'Design & Creative',
    'Tools & Technologies'
  ];

  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-2xl)' }}>
      {/* Hero Section */}
      <section className="neumorphic-raised" style={{ 
        padding: 'var(--spacing-2xl)', 
        marginBottom: 'var(--spacing-2xl)',
        textAlign: 'center'
      }}>
        <div style={{ 
          width: 'clamp(150px, 25vw, 200px)', 
          height: 'clamp(150px, 25vw, 200px)', 
          borderRadius: '50%',
          margin: '0 auto var(--spacing-xl)',
          backgroundImage: `url(${aboutData.avatar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '4px solid var(--accent-primary)'
        }} />
        
        <h1 className="text-embossed" style={{ 
          fontSize: 'clamp(2rem, 6vw, 3rem)', 
          marginBottom: 'var(--spacing-lg)',
          fontFamily: 'var(--font-display)'
        }}>
          {aboutData.name}
        </h1>
        
        <p className="text-engraved" style={{ 
          fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', 
          marginBottom: 'var(--spacing-xl)',
          maxWidth: '600px',
          margin: '0 auto var(--spacing-xl)'
        }}>
          {aboutData.headline}
        </p>
        
        <p style={{ 
          fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', 
          lineHeight: 1.7,
          maxWidth: '800px',
          margin: '0 auto',
          color: 'var(--text-secondary)'
        }}>
          {aboutData.bio}
        </p>
      </section>

      {/* Skills Section */}
      <section className="neumorphic-raised" style={{ 
        padding: 'var(--spacing-2xl)', 
        marginBottom: 'var(--spacing-2xl)'
      }}>
        <h2 className="text-embossed" style={{ 
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
          marginBottom: 'var(--spacing-xl)',
          textAlign: 'center'
        }}>
          Skills & Expertise
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--spacing-xl)'
        }}>
          {skillCategories.map(category => {
            const categorySkills = getSkillsByCategory(category);
            if (categorySkills.length === 0) return null;
            
            return (
              <div key={category} className="neumorphic-inset" style={{ 
                padding: 'var(--spacing-lg)'
              }}>
                <h3 style={{ 
                  fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
                  marginBottom: 'var(--spacing-lg)',
                  color: 'var(--accent-primary)',
                  textAlign: 'center'
                }}>
                  {category}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {categorySkills.map(skill => (
                    <div key={skill.id}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: 'var(--spacing-xs)'
                      }}>
                        <span style={{ 
                          fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                          wordBreak: 'break-word'
                        }}>
                          {skill.name}
                        </span>
                        <span style={{ 
                          fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', 
                          color: 'var(--text-secondary)',
                          flexShrink: 0,
                          marginLeft: 'var(--spacing-sm)'
                        }}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className="neumorphic-inset" style={{
                        height: '8px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${skill.level}%`,
                          height: '100%',
                          backgroundColor: 'var(--accent-primary)',
                          borderRadius: 'var(--radius-sm)',
                          transition: 'width 1s ease-in-out'
                        }} />
                      </div>
                      {skill.description && (
                        <p style={{ 
                          fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', 
                          color: 'var(--text-secondary)',
                          marginTop: 'var(--spacing-xs)',
                          lineHeight: 1.4
                        }}>
                          {skill.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="neumorphic-raised" style={{ 
        padding: 'var(--spacing-2xl)', 
        marginBottom: 'var(--spacing-2xl)'
      }}>
        <h2 className="text-embossed" style={{ 
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
          marginBottom: 'var(--spacing-xl)',
          textAlign: 'center'
        }}>
          Creative Philosophy
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--spacing-xl)'
        }}>
          <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)' }}>
            <h3 style={{ 
              fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--accent-primary)'
            }}>
              🎨 Design with Emotion
            </h3>
            <p style={{ 
              lineHeight: 1.6,
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
            }}>
              Every project begins with understanding the emotional core. Whether it's the thrill of discovery in a game, 
              the comfort of familiarity in a brand, or the wonder of exploration in a story—emotion drives design decisions.
            </p>
          </div>
          
          <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)' }}>
            <h3 style={{ 
              fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--accent-primary)'
            }}>
              ⚡ Code with Purpose
            </h3>
            <p style={{ 
              lineHeight: 1.6,
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
            }}>
              Technology serves the creative vision. Clean, efficient code that's maintainable and scalable, 
              but never at the expense of the user experience or artistic integrity.
            </p>
          </div>
          
          <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)' }}>
            <h3 style={{ 
              fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--accent-primary)'
            }}>
              ✍️ Write with Vision
            </h3>
            <p style={{ 
              lineHeight: 1.6,
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
            }}>
              Stories that transport, characters that resonate, worlds that feel lived-in. 
              Every word serves the narrative, every scene builds toward the climax.
            </p>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="neumorphic-raised" style={{ 
        padding: 'var(--spacing-2xl)', 
        marginBottom: 'var(--spacing-2xl)'
      }}>
        <h2 className="text-embossed" style={{ 
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
          marginBottom: 'var(--spacing-xl)',
          textAlign: 'center'
        }}>
          Experience & Background
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--spacing-xl)'
        }}>
          <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)' }}>
            <h3 style={{ 
              fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--accent-primary)'
            }}>
              🎓 Education
            </h3>
            <p style={{ 
              lineHeight: 1.6,
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
            }}>
              {aboutData.education || 'Self-taught creative technologist with a passion for interdisciplinary learning and continuous growth.'}
            </p>
          </div>
          
          <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)' }}>
            <h3 style={{ 
              fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--accent-primary)'
            }}>
              💼 Work Experience
            </h3>
            <p style={{ 
              lineHeight: 1.6,
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
            }}>
              {aboutData.experience || 'Freelance creative professional with experience across multiple industries and project types.'}
            </p>
          </div>
          
          <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)' }}>
            <h3 style={{ 
              fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--accent-primary)'
            }}>
              🎯 Current Focus
            </h3>
            <p style={{ 
              lineHeight: 1.6,
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
            }}>
              {aboutData.focus || 'Exploring the intersection of technology and creativity, building immersive experiences that connect with audiences on an emotional level.'}
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="neumorphic-raised" style={{ 
        padding: 'var(--spacing-2xl)', 
        textAlign: 'center'
      }}>
        <h2 className="text-embossed" style={{ 
          fontSize: '2rem', 
          marginBottom: 'var(--spacing-lg)'
        }}>
          Ready to collaborate?
        </h2>
        <p style={{ 
          fontSize: '1.1rem', 
          marginBottom: 'var(--spacing-xl)',
          color: 'var(--text-secondary)'
        }}>
          Let's create something extraordinary together.
        </p>
        <a 
          href="/contact" 
          className="btn btn-pill"
          style={{ textDecoration: 'none' }}
        >
          Get in Touch
        </a>
      </section>
    </div>
  );
};

export default AboutPage; 