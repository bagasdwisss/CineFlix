import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cineflix_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('cineflix_theme', theme);
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'light') {
      root.classList.add('light');
      body.classList.add('light');
      root.classList.remove('dark');
      body.classList.remove('dark');
    } else {
      root.classList.remove('light');
      body.classList.remove('light');
      root.classList.add('dark');
      body.classList.add('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark', isLight: theme === 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'dark',
      setTheme: () => {},
      toggleTheme: () => {},
      isDark: true,
      isLight: false
    };
  }
  return context;
};
