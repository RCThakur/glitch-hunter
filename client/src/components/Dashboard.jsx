import React, { useState } from 'react';
import GlitchButton from './GlitchButton';
import SettingsModal from './SettingsModal';
import InstructionsModal from './InstructionsModal';
import LoginModal from './LoginModal';
import { Play, Settings, BookOpen, User, UserPlus } from 'lucide-react';
import '../styles/glitch.css';

const Dashboard = ({ 
  gameState, 
  audioManager, 
  onLogin, 
  onGuestPlay, 
  onStartGame, 
  onUpdatePreferences 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handlePlayNow = () => {
    if (gameState.isLoggedIn) {
      onStartGame();
    } else {
      setShowLogin(true);
    }
  };

  const handleLogin = async (username, password) => {
    const success = await onLogin(username, password);
    if (success) {
      setShowLogin(false);
      audioManager?.playClickSound();
    }
    return success;
  };

  const handleGuestPlay = async () => {
    const success = await onGuestPlay();
    if (success) {
      audioManager?.playClickSound();
    }
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
    audioManager?.playClickSound();
  };

  const handleInstructionsClick = () => {
    setShowInstructions(true);
    audioManager?.playClickSound();
  };

  return (
    <div className="dashboard-container min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Glitch Background - continued from landing */}
      <div className="glitch-bg absolute inset-0">
        <div className="glitch-layer glitch-layer-1"></div>
        <div className="glitch-layer glitch-layer-2"></div>
        <div className="glitch-layer glitch-layer-3"></div>
      </div>

      {/* Static Noise Overlay */}
      <div className="noise-overlay absolute inset-0 opacity-10"></div>

      {/* Header */}
      <div className="z-10 text-center mb-16">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-2 tracking-wider">
          <span className="glitch-text text-cyan-400" data-text="GL!TCH">GL!TCH</span>
          <span className="text-white"> </span>
          <span className="glitch-text text-magenta-400" data-text="HUNTER">HUNTER</span>
        </h1>
        {gameState.isLoggedIn && (
          <p className="text-cyan-400 font-mono text-xl">
            Welcome back, <span className="text-magenta-400">{gameState.username}</span>
          </p>
        )}
      </div>

      {/* Main Menu Buttons */}
      <div className="z-10 flex flex-col gap-6 w-full max-w-md px-8">
        <GlitchButton
          onClick={handlePlayNow}
          icon={<Play className="w-6 h-6" />}
          className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400"
          glitchColor="cyan"
        >
          {gameState.isLoggedIn ? 'CONTINUE HUNT' : 'PLAY NOW'}
        </GlitchButton>

        {!gameState.isLoggedIn && (
          <>
            <GlitchButton
              onClick={() => setShowLogin(true)}
              icon={<User className="w-6 h-6" />}
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400"
              glitchColor="purple"
            >
              LOGIN
            </GlitchButton>

            <GlitchButton
              onClick={handleGuestPlay}
              icon={<UserPlus className="w-6 h-6" />}
              className="bg-gradient-to-r from-magenta-600 to-magenta-500 hover:from-magenta-500 hover:to-magenta-400"
              glitchColor="magenta"
            >
              PLAY AS GUEST
            </GlitchButton>
          </>
        )}

        <GlitchButton
          onClick={handleSettingsClick}
          icon={<Settings className="w-6 h-6" />}
          className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
          glitchColor="gray"
        >
          SETTINGS
        </GlitchButton>

        <GlitchButton
          onClick={handleInstructionsClick}
          icon={<BookOpen className="w-6 h-6" />}
          className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400"
          glitchColor="yellow"
        >
          INSTRUCTION MANUAL
        </GlitchButton>
      </div>

      {/* System Status */}
      <div className="z-10 absolute bottom-8 left-8 text-cyan-400 font-mono text-sm">
        <div className="glitch-border p-4 bg-black bg-opacity-50">
          <div>SYSTEM STATUS: <span className="text-green-400">OPERATIONAL</span></div>
          <div>GLITCH LEVEL: <span className="text-yellow-400">MODERATE</span></div>
          <div>HUNTERS ONLINE: <span className="text-cyan-400">1,337</span></div>
        </div>
      </div>

      {/* Floating Glitch Cubes */}
      <div className="glitch-cubes absolute inset-0 pointer-events-none">
        <div className="glitch-cube cube-1"></div>
        <div className="glitch-cube cube-2"></div>
        <div className="glitch-cube cube-3"></div>
        <div className="glitch-cube cube-4"></div>
        <div className="glitch-cube cube-5"></div>
      </div>

      {/* Modals */}
      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          preferences={gameState.preferences}
          onUpdatePreferences={onUpdatePreferences}
          audioManager={audioManager}
        />
      )}

      {showInstructions && (
        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          audioManager={audioManager}
        />
      )}

      {showLogin && (
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
          audioManager={audioManager}
        />
      )}
    </div>
  );
};

export default Dashboard;