// src/theme.js

export const lightTheme = {
    // Base Colors
    background: '#FFFFFF',        // White background
    text: '#2F2F2F',              // Dark gray text
    buttonBackground: '#28A745',  // Primary action (green)
    buttonText: '#FFFFFF',        // White text on buttons
    cameraOverlay: 'rgba(0, 0, 0, 0.3)', // Semi-transparent dark overlay
    loaderColor: '#28A745',       // Loader color matches primary green
  
    // Feedback / State Colors
    primary: '#28A745',   // Main green
    secondary: '#74C274', // Secondary green
    success: '#28A745',   // Success messages/indicators
    warning: '#FFC107',   // Warning (yellow)
    danger: '#DC3545',    // Danger (red)
    contrast: '#000000',  // Extra contrast color if needed
  };
  
  export const darkTheme = {
    // Base Colors
    background: '#121A13',         // Very dark green-ish background
    text: '#FFFFFF',               // White text for contrast
    buttonBackground: '#74C274',   // Medium green for buttons
    buttonText: '#121A13',         // Dark text on lighter green buttons
    cameraOverlay: 'rgba(255, 255, 255, 0.2)', // Semi-transparent light overlay
    loaderColor: '#B2E7B2',        // Soft green loader
  
    // Feedback / State Colors
    primary: '#28A745',   // Main green
    secondary: '#74C274', // Secondary green
    success: '#28A745',   // Success messages/indicators
    warning: '#FFC107',   // Warning (yellow)
    danger: '#DC3545',    // Danger (red)
    contrast: '#FFFFFF',  // Extra contrast color if needed
  };
  