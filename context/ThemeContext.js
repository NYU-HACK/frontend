// src/ThemeContext.js
import React, { createContext, useState, useContext } from 'react';
import { lightTheme, darkTheme } from '../theme';

// Create Context
const ThemeContext = createContext();

// Custom Hook to use Theme
export const useTheme = () => useContext(ThemeContext);

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme); // Default to light theme

  // Toggle Theme Function
  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
