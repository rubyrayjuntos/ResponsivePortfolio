import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { marked } from 'marked';
import '../styles/markdownModal.css';

const MarkdownModal = ({ isOpen, onClose, documentUrl, title }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Move loadDocument above useEffect
  const loadDocument = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(documentUrl);
      if (!response.ok) {
        throw new Error(`Failed to load document: ${response.status}`);
      }
      const text = await response.text();
      setContent(text);
    } catch (err) {
      setError(err.message);
      console.error('Error loading markdown document:', err);
    } finally {
      setLoading(false);
    }
  }, [documentUrl]);

  useEffect(() => {
    if (isOpen && documentUrl) {
      loadDocument();
    }
  }, [isOpen, documentUrl, loadDocument]);

  const renderMarkdown = (markdown) => {
    try {
      // Use marked library for proper markdown rendering
      return marked(markdown, {
        breaks: true,
        gfm: true
      });
    } catch (error) {
      console.error('Error rendering markdown:', error);
      // Fallback to simple text rendering
      return markdown.replace(/\n/g, '<br>');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--spacing-lg)'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '90vw',
            maxHeight: '90vh',
            width: '800px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: 'var(--spacing-lg)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            <h2 className="text-embossed" style={{ margin: 0, fontSize: '1.5rem' }}>
              {title || 'Document'}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                padding: 'var(--spacing-xs)',
                borderRadius: 'var(--radius-sm)',
                transition: 'all var(--transition-normal)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--bg-tertiary)';
                e.target.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-secondary)';
              }}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: 'var(--spacing-xl)',
            lineHeight: 1.6
          }}>
            {loading && (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>📄</div>
                <p>Loading document...</p>
              </div>
            )}

            {error && (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>❌</div>
                <p style={{ color: 'var(--text-error)' }}>Error loading document</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{error}</p>
              </div>
            )}

            {!loading && !error && content && (
              <div 
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  lineHeight: 1.6
                }}
                className="markdown-content"
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MarkdownModal; 