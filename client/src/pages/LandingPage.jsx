import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LandingPage = ({ onLoadingComplete, audioManager }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const musicTimer = setTimeout(() => {
      audioManager?.playBackgroundMusic();
    }, 1000);

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
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onLoadingComplete();
            }, 500);
            return 100;
          }
          return prev + 2.5;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [showLoading, onLoadingComplete]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Glitch Background Layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-black to-purple-900 opacity-30 animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 text-center mb-20"
      >
        <h1 className="text-7xl md:text-9xl font-extrabold text-white tracking-widest relative">
          <span className="relative before:absolute before:inset-0 before:animate-glitch text-cyan-400">
            GL!TCH
          </span>
        </h1>
        <h2 className="text-5xl md:text-7xl font-extrabold text-purple-400 tracking-wider mt-4 relative">
          <span className="relative before:absolute before:inset-0 before:animate-glitch text-pink-500">
            HUNTER
          </span>
        </h2>
      </motion.div>

      {/* Loading Bar */}
      {showLoading && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 w-full max-w-2xl px-8"
        >
          <div className="bg-gray-800 h-3 rounded-full border border-cyan-500 overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600"
              style={{ width: `${loadingProgress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>
          <div className="text-center mt-4 text-cyan-400 font-mono text-lg">
            INITIALIZING SYSTEM... {Math.round(loadingProgress)}%
          </div>
        </motion.div>
      )}

      {/* Floating Glitch Cubes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className={`w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-md opacity-40`}
            initial={{ x: Math.random() * 500 - 250, y: Math.random() * 500 - 250, scale: 0 }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 6 + i,
              delay: i * 0.5,
            }}
            style={{
              position: "absolute",
              top: `${20 + i * 15}%`,
              left: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
