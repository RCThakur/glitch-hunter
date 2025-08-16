import React, { useEffect, useState } from 'react';
import '../styles/glitch.css';

const LandingPage = ({ onLoadingComplete, audioManager }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Start background music after a short delay
    const musicTimer = setTimeout(() => {
      audioManager?.playBackgroundMusic();
    }, 1000);

    // Show loading bar after title animation
    const loadingTimer = setTimeout(() => {
      setShowLoading(true);
    }, 2000);

    return () => {
      clearTimeout(musicTimer);
      clearTimeout(loadingTimer);
    };
  }, [audioManager]);

  useEffect(() => {
    if (showLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onLoadingComplete();
            }, 500);
            return 100;
          }
          return prev + 2.5; // Complete in 4 seconds (100 / 2.5 = 40 intervals * 100ms = 4000ms)
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [showLoading, onLoadingComplete]);

  return (
    <div className="landing-container min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Glitch Background */}
      <div className="glitch-bg absolute inset-0">
        <div className="glitch-layer glitch-layer-1"></div>
        <div className="glitch-layer glitch-layer-2"></div>
        <div className="glitch-layer glitch-layer-3"></div>
      </div>

      {/* Static Noise Overlay */}
      <div className="noise-overlay absolute inset-0 opacity-20"></div>

      {/* Main Title */}
      <div className="z-10 text-center mb-20">
        <h1 className="glitch-title text-8xl md:text-9xl font-bold text-white mb-4 tracking-wider">
          <span className="glitch-text" data-text="GL!TCH">GL!TCH</span>
        </h1>
        <h2 className="text-6xl md:text-7xl font-bold text-cyan-400 tracking-widest glitch-subtitle">
          <span className="glitch-text" data-text="HUNTER">HUNTER</span>
        </h2>
      </div>

      {/* Loading Bar */}
      {showLoading && (
        <div className="z-10 w-full max-w-2xl px-8">
          <div className="loading-container relative">
            <div className="loading-bar-bg bg-gray-800 h-3 rounded-full border border-cyan-500 overflow-hidden">
              <div 
                className="loading-bar h-full bg-gradient-to-r from-cyan-400 via-magenta-500 to-purple-600 transition-all duration-100 ease-linear"
                style={{ width: `${loadingProgress}%` }}
              >
                <div className="loading-glow absolute inset-0 bg-gradient-to-r from-cyan-400 via-magenta-500 to-purple-600 blur-sm opacity-75"></div>
              </div>
            </div>
            <div className="text-center mt-4 text-cyan-400 font-mono text-lg">
              INITIALIZING SYSTEM... {Math.round(loadingProgress)}%
            </div>
          </div>
        </div>
      )}

      {/* Floating Glitch Cubes */}
      <div className="glitch-cubes absolute inset-0 pointer-events-none">
        <div className="glitch-cube cube-1"></div>
        <div className="glitch-cube cube-2"></div>
        <div className="glitch-cube cube-3"></div>
        <div className="glitch-cube cube-4"></div>
      </div>
    </div>
  );
};

export default LandingPage;