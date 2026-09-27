// frontend/src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('moneyway_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      // Default to dark mode for Money Way's signature aesthetic
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
        root.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        document.body.style.backgroundColor = '#F8FAFC';
        document.body.style.color = '#0F172A';
      } else {
        root.classList.remove('light');
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        document.body.style.backgroundColor = '#070A09';
        document.body.style.color = '#F5F7F5';
      }
      localStorage.setItem('moneyway_theme', theme);
    } catch (err) {
      console.error('Error applying theme:', err);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme);
    }
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
