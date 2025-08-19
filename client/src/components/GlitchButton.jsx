import React from 'react';
import '../styles/glitch.css';

const GlitchButton = ({ 
  children, 
  onClick, 
  icon, 
  className = '', 
  glitchColor = 'cyan',
  disabled = false 
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      // Play click sound effect
      const audio = new Audio('/audio/click.wav');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio play errors
      });
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        glitch-button
        relative w-full py-4 px-8 
        text-white font-bold text-xl tracking-wider
        border-2 border-current
        transition-all duration-200 
        transform hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      data-glitch-color={glitchColor}
    >
      {/* Button Background with Glitch Effect */}
      <div className="absolute inset-0 bg-current opacity-20 glitch-bg-effect"></div>
      
      {/* Button Content */}
      <div className="relative flex items-center justify-center gap-3">
        {icon && (
          <span className="glitch-icon">
            {icon}
          </span>
        )}
        <span className="glitch-text" data-text={children}>
          {children}
        </span>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-current opacity-0 blur-md transition-opacity duration-200 hover:opacity-30"></div>
      
      {/* Border Glow */}
      <div className="absolute inset-0 border-2 border-current opacity-0 blur-sm transition-opacity duration-200 hover:opacity-60"></div>
    </button>
  );
};

export default GlitchButton;