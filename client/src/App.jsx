
import React, { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AudioManager from './utils/AudioManager';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [audioManager] = useState(() => new AudioManager());
  const [gameState, setGameState] = useState({
    isLoggedIn: false,
    username: null,
    preferences: {
      volume: 50,
      sfx: true,
      difficulty: 'medium'
    }
  });

  useEffect(() => {
    // Initialize audio manager
    audioManager.init();
    
    // Load user preferences from localStorage
    const savedPrefs = localStorage.getItem('glitchHunterPrefs');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setGameState(prev => ({ ...prev, preferences: prefs }));
      audioManager.setVolume(prefs.volume);
      audioManager.setSfxEnabled(prefs.sfx);
    }
  }, [audioManager]);

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  const updatePreferences = (newPrefs) => {
    const updatedState = {
      ...gameState,
      preferences: { ...gameState.preferences, ...newPrefs }
    };
    setGameState(updatedState);
    localStorage.setItem('glitchHunterPrefs', JSON.stringify(updatedState.preferences));
    
    // Update audio manager
    if (newPrefs.volume !== undefined) audioManager.setVolume(newPrefs.volume);
    if (newPrefs.sfx !== undefined) audioManager.setSfxEnabled(newPrefs.sfx);
  };

  const handleLogin = async (username, password) => {
    try {
      // Mock API call - replace with real backend call later
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      // Mock response for now
      const mockResponse = {
        success: true,
        token: 'mock-jwt-token',
        user: { id: 1, username }
      };
      
      if (mockResponse.success) {
        setGameState(prev => ({
          ...prev,
          isLoggedIn: true,
          username: mockResponse.user.username
        }));
        localStorage.setItem('glitchHunterToken', mockResponse.token);
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const handleGuestPlay = async () => {
    try {
      // Mock API call - replace with real backend call later
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Mock response
      const mockResponse = {
        success: true,
        guestId: 'guest-' + Date.now()
      };
      
      if (mockResponse.success) {
        setGameState(prev => ({
          ...prev,
          isLoggedIn: true,
          username: 'Guest Player'
        }));
        return true;
      }
    } catch (error) {
      console.error('Guest login failed:', error);
      return false;
    }
  };

  const startGame = async () => {
    try {
      // Mock API call - replace with real backend call later
      const response = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: gameState.username,
          difficulty: gameState.preferences.difficulty 
        })
      });
      
      console.log('Starting GL!TCH HUNTER game...');
      // Game start logic will go here
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  return (
    <div className="App min-h-screen bg-black overflow-hidden">
      {currentPage === 'landing' && (
        <LandingPage 
          onLoadingComplete={() => navigateToPage('dashboard')}
          audioManager={audioManager}
        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard 
          gameState={gameState}
          audioManager={audioManager}
          onLogin={handleLogin}
          onGuestPlay={handleGuestPlay}
          onStartGame={startGame}
          onUpdatePreferences={updatePreferences}
        />
      )}
    </div>
  );
}

export default App;
