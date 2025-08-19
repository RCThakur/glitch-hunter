import React from 'react';
import { X, Target, Zap, Shield, Trophy } from 'lucide-react';
import GlitchButton from './GlitchButton';
import '../styles/glitch.css';

const InstructionsModal = ({ isOpen, onClose, audioManager }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    audioManager?.playClickSound();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-gray-900 border-2 border-cyan-500 rounded-lg p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto glitch-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-cyan-400 glitch-text" data-text="INSTRUCTION MANUAL">
            INSTRUCTION MANUAL
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Instructions Content */}
        <div className="space-y-8 text-gray-200">
          {/* Game Overview */}
          <section>
            <h3 className="text-2xl font-bold text-magenta-400 mb-4 flex items-center gap-3">
              <Target className="w-8 h-8" />
              MISSION BRIEFING
            </h3>
            <p className="text-lg leading-relaxed">
              Welcome to GL!TCH HUNTER, operative. The digital realm has been corrupted by 
              rogue <span className="text-cyan-400 font-bold">Glitch Cubes</span> that are 
              causing chaos throughout the system. Your mission is to hunt down and eliminate 
              these digital anomalies before they crash the entire network.
            </p>
          </section>

          {/* Gameplay Mechanics */}
          <section>
            <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-3">
              <Zap className="w-8 h-8" />
              GAMEPLAY MECHANICS
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded border-l-4 border-cyan-400">
                <h4 className="text-cyan-400 font-bold text-lg mb-2">HUNTING</h4>
                <p>Use your mouse/touch to track and target glitch cubes. Each cube has a different 
                corruption level - higher levels require more precise timing to eliminate.</p>
              </div>
              <div className="bg-gray-800 p-4 rounded border-l-4 border-magenta-400">
                <h4 className="text-magenta-400 font-bold text-lg mb-2">CORRUPTION LEVELS</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><span className="text-green-400">LOW</span> - Slow moving, easy targets</li>
                  <li><span className="text-yellow-400">MODERATE</span> - Faster, unpredictable movement</li>
                  <li><span className="text-red-400">CRITICAL</span> - Rapid, chaotic behavior</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Controls */}
          <section>
            <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-3">
              <Shield className="w-8 h-8" />
              CONTROLS
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded">
                <h4 className="text-cyan-400 font-bold mb-2">DESKTOP</h4>
                <ul className="space-y-1 font-mono text-sm">
                  <li><span className="text-yellow-400">MOUSE</span> - Aim and target</li>
                  <li><span className="text-yellow-400">CLICK</span> - Fire elimination pulse</li>
                  <li><span className="text-yellow-400">SPACE</span> - Pause/Resume</li>
                  <li><span className="text-yellow-400">ESC</span> - Exit to menu</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded">
                <h4 className="text-cyan-400 font-bold mb-2">MOBILE</h4>
                <ul className="space-y-1 font-mono text-sm">
                  <li><span className="text-yellow-400">TOUCH</span> - Aim and fire</li>
                  <li><span className="text-yellow-400">HOLD</span> - Charge power shot</li>
                  <li><span className="text-yellow-400">SWIPE</span> - Quick targeting</li>
                  <li><span className="text-yellow-400">TAP MENU</span> - Access options</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Scoring System */}
          <section>
            <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              SCORING SYSTEM
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-gray-800 p-3 rounded">
                <span className="text-green-400 font-bold">LOW CORRUPTION CUBE</span>
                <span className="text-cyan-400 font-mono">+100 PTS</span>
              </div>
              <div className="flex justify-between items-center bg-gray-800 p-3 rounded">
                <span className="text-yellow-400 font-bold">MODERATE CORRUPTION CUBE</span>
                <span className="text-cyan-400 font-mono">+250 PTS</span>
              </div>
              <div className="flex justify-between items-center bg-gray-800 p-3 rounded">
                <span className="text-red-400 font-bold">CRITICAL CORRUPTION CUBE</span>
                <span className="text-cyan-400 font-mono">+500 PTS</span>
              </div>
              <div className="flex justify-between items-center bg-gray-800 p-3 rounded border border-purple-500">
                <span className="text-purple-400 font-bold">COMBO MULTIPLIER</span>
                <span className="text-cyan-400 font-mono">+2x-5x</span>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">HUNTER TIPS</h3>
            <div className="bg-gray-800 p-6 rounded border border-cyan-500">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">▶</span>
                  <span>Watch for glitch patterns - cubes often move in predictable sequences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">▶</span>
                  <span>Build combos by eliminating cubes in rapid succession</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">▶</span>
                  <span>Critical corruption cubes split into smaller cubes when eliminated</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">▶</span>
                  <span>Use the glitch trails to predict where cubes will appear next</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Close Button */}
        <div className="mt-8 flex justify-center">
          <GlitchButton
            onClick={handleClose}
            className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400"
            glitchColor="cyan"
          >
            UNDERSTOOD
          </GlitchButton>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;