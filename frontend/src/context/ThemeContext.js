import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children, initialTheme }) => {
  const [currentTheme, setCurrentTheme] = useState(initialTheme?.currentTheme || 'default');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
  };

  const resetTheme = () => {
    setCurrentTheme('default');
  };

  const contextValue = {
    currentTheme,
    changeTheme,
    resetTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}; 