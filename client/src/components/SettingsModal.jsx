import React, { useState } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import GlitchButton from './GlitchButton';
import '../styles/glitch.css';

const SettingsModal = ({ isOpen, onClose, preferences, onUpdatePreferences, audioManager }) => {
  const [localPrefs, setLocalPrefs] = useState(preferences);

  if (!isOpen) return null;

  const handleVolumeChange = (volume) => {
    const newVolume = parseInt(volume);
    setLocalPrefs(prev => ({ ...prev, volume: newVolume }));
    onUpdatePreferences({ volume: newVolume });
  };

  const handleSfxToggle = () => {
    const newSfx = !localPrefs.sfx;
    setLocalPrefs(prev => ({ ...prev, sfx: newSfx }));
    onUpdatePreferences({ sfx: newSfx });
  };

  const handleDifficultyChange = (difficulty) => {
    setLocalPrefs(prev => ({ ...prev, difficulty }));
    onUpdatePreferences({ difficulty });
  };

  const handleSave = async () => {
    try {
      // Mock API call - replace with real backend call later
      const response = await fetch(`/api/user/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localPrefs)
      });
      
      console.log('Settings saved to backend (mock)');
      audioManager?.playClickSound();
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-gray-900 border-2 border-cyan-500 rounded-lg p-8 w-full max-w-md mx-4 glitch-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-cyan-400 glitch-text" data-text="SETTINGS">
            SETTINGS
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="space-y-8">
          {/* Volume Control */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 text-white font-bold text-lg">
              {localPrefs.volume > 0 ? (
                <Volume2 className="w-6 h-6 text-cyan-400" />
              ) : (
                <VolumeX className="w-6 h-6 text-gray-500" />
              )}
              VOLUME
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={localPrefs.volume}
                onChange={(e) => handleVolumeChange(e.target.value)}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-cyan"
              />
              <div className="text-cyan-400 font-mono text-right">
                {localPrefs.volume}%
              </div>
            </div>
          </div>

          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-white font-bold text-lg">
              SOUND EFFECTS
            </label>
            <button
              onClick={handleSfxToggle}
              className={`
                relative w-16 h-8 rounded-full transition-colors duration-200
                ${localPrefs.sfx ? 'bg-cyan-600' : 'bg-gray-600'}
              `}
            >
              <div className={`
                absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200
                ${localPrefs.sfx ? 'translate-x-9' : 'translate-x-1'}
              `}></div>
            </button>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-4">
            <label className="text-white font-bold text-lg">
              DIFFICULTY
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  onClick={() => handleDifficultyChange(level)}
                  className={`
                    py-2 px-4 font-bold text-sm uppercase border-2 transition-all duration-200
                    ${localPrefs.difficulty === level 
                      ? 'bg-cyan-600 border-cyan-400 text-white' 
                      : 'bg-gray-700 border-gray-500 text-gray-300 hover:border-cyan-500'
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <GlitchButton
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400"
              glitchColor="cyan"
            >
              SAVE
            </GlitchButton>
            <GlitchButton
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
              glitchColor="gray"
            >
              CANCEL
            </GlitchButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;