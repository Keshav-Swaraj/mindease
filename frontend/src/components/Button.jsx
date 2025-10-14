// src/components/Button.jsx
import React from 'react';

// A reusable button that accepts different styles via a "variant" prop
const Button = ({ children, onClick, variant = 'primary' }) => {
  // Base styles for all buttons
  const baseStyle = 'w-full py-3 px-4 rounded-xl font-semibold transition-transform transform hover:scale-105 shadow-md';

  // Specific styles for each variant
  const styles = {
    primary: 'bg-primary text-white',
    secondary: 'bg-white text-secondary border border-secondary',
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${styles[variant]}`}>
      {children}
    </button>
  );
};

export default Button;