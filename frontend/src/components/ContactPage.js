import React, { useState } from 'react';
import aboutData from '../data/about.json';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-2xl)' }}>
      {/* Hero Section */}
      <section className="neumorphic-raised" style={{ 
        padding: 'var(--spacing-2xl)', 
        marginBottom: 'var(--spacing-2xl)',
        textAlign: 'center'
      }}>
        <h1 className="text-embossed" style={{ 
          fontSize: '3rem', 
          marginBottom: 'var(--spacing-lg)',
          fontFamily: 'var(--font-display)'
        }}>
          Let's Connect
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          lineHeight: 1.7,
          maxWidth: '600px',
          margin: '0 auto',
          color: 'var(--text-secondary)'
        }}>
          Whether you have a project in mind, want to collaborate, or just want to say hello—I'd love to hear from you.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2xl)' }}>
        {/* Contact Form */}
        <section className="neumorphic-raised" style={{ padding: 'var(--spacing-2xl)' }}>
          <h2 className="text-embossed" style={{ 
            fontSize: '2rem', 
            marginBottom: 'var(--spacing-xl)'
          }}>
            Send a Message
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            <div>
              <label htmlFor="name" style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-sm)',
                fontWeight: 'bold'
              }}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="neumorphic-input"
              />
            </div>
            
            <div>
              <label htmlFor="email" style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-sm)',
                fontWeight: 'bold'
              }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="neumorphic-input"
              />
            </div>
            
            <div>
              <label htmlFor="subject" style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-sm)',
                fontWeight: 'bold'
              }}>
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="neumorphic-input"
              />
            </div>
            
            <div>
              <label htmlFor="message" style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-sm)',
                fontWeight: 'bold'
              }}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="neumorphic-input"
                style={{ resize: 'vertical' }}
              />
            </div>
            
            <button type="submit" className="btn btn-pill" style={{ alignSelf: 'flex-start' }}>
              Send Message
            </button>
          </form>
        </section>

        {/* Contact Info */}
        <section className="neumorphic-raised" style={{ padding: 'var(--spacing-2xl)' }}>
          <h2 className="text-embossed" style={{ 
            fontSize: '2rem', 
            marginBottom: 'var(--spacing-xl)'
          }}>
            Get in Touch
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
            {/* Email */}
            <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)' }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                marginBottom: 'var(--spacing-md)',
                color: 'var(--accent-primary)'
              }}>
                📧 Email
              </h3>
              <a 
                href={`mailto:${aboutData.contact.email}`}
                style={{ 
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '1.1rem'
                }}
              >
                {aboutData.contact.email}
              </a>
            </div>

            {/* Social Links */}
            <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)' }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                marginBottom: 'var(--spacing-lg)',
                color: 'var(--accent-primary)'
              }}>
                🌐 Social
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <a 
                  href={aboutData.contact.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-pill"
                  style={{ 
                    textDecoration: 'none',
                    textAlign: 'left',
                    justifyContent: 'flex-start'
                  }}
                >
                  <span style={{ marginRight: 'var(--spacing-sm)' }}>🐙</span>
                  GitHub
                </a>
                <a 
                  href={aboutData.contact.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-pill"
                  style={{ 
                    textDecoration: 'none',
                    textAlign: 'left',
                    justifyContent: 'flex-start'
                  }}
                >
                  <span style={{ marginRight: 'var(--spacing-sm)' }}>💼</span>
                  LinkedIn
                </a>
                <a 
                  href={aboutData.contact.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-pill"
                  style={{ 
                    textDecoration: 'none',
                    textAlign: 'left',
                    justifyContent: 'flex-start'
                  }}
                >
                  <span style={{ marginRight: 'var(--spacing-sm)' }}>🐦</span>
                  Twitter
                </a>
              </div>
            </div>

            {/* Availability */}
            <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)' }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                marginBottom: 'var(--spacing-md)',
                color: 'var(--accent-primary)'
              }}>
                📅 Availability
              </h3>
              <p style={{ 
                fontSize: '1.1rem',
                color: aboutData.availability ? 'var(--accent-primary)' : 'var(--text-secondary)'
              }}>
                {aboutData.availability ? '🟢 Available for new projects' : '🔴 Currently unavailable'}
              </p>
            </div>

            {/* Response Time */}
            <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)' }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                marginBottom: 'var(--spacing-md)',
                color: 'var(--accent-primary)'
              }}>
                ⏱️ Response Time
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                I typically respond within 24-48 hours during business days.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Collaboration Types */}
      <section className="neumorphic-raised" style={{ 
        padding: 'var(--spacing-2xl)', 
        marginTop: 'var(--spacing-2xl)'
      }}>
        <h2 className="text-embossed" style={{ 
          fontSize: '2.5rem', 
          marginBottom: 'var(--spacing-xl)',
          textAlign: 'center'
        }}>
          Types of Collaboration
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-lg)'
        }}>
          <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--accent-primary)'
            }}>
              🎮 Game Development
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
              Full-stack game development, interactive experiences, and creative coding projects.
            </p>
          </div>
          
          <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--accent-primary)'
            }}>
              🎨 Creative Direction
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
              Brand identity, visual design, and creative strategy for digital and print media.
            </p>
          </div>
          
          <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--accent-primary)'
            }}>
              ✍️ Content Creation
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
              Creative writing, storytelling, and content strategy for digital platforms.
            </p>
          </div>
          
          <div className="neumorphic-inset" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: 'var(--spacing-md)',
              color: 'var(--accent-primary)'
            }}>
              🤝 Consulting
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
              Creative and technical consulting for multidisciplinary projects and teams.
            </p>
          </div>
        </div>
      </section>

      {/* Responsive Design */}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage; 