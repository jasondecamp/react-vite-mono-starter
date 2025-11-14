import React from 'react';
import './Button.css';

export const Button = ({ 
  label, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false 
}) => {
  const className = `button button--${variant} button--${size}`;
  
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
