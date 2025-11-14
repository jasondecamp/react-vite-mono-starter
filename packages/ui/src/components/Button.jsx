import React from 'react';
import { classNames } from '@react-vite-mono-starter/services/helpers';
import './Button.css';

export const Button = ({ 
  label, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className: additionalClassName = ''
}) => {
  const buttonClasses = classNames(
    'button',
    `button--${variant}`,
    `button--${size}`,
    additionalClassName
  );
  
  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
