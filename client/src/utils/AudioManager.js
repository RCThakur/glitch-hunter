
class AudioManager {
  constructor() {
    this.backgroundMusic = null;
    this.clickSound = null;
    this.volume = 50;
    this.sfxEnabled = true;
    this.musicEnabled = true;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      // Initialize background music with error handling
      this.backgroundMusic = new Audio('/audio/background-loop.mp3');
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.3;
      this.backgroundMusic.onerror = () => {
        console.warn('Background music file not found - using silent mode');
        this.musicEnabled = false;
      };

      // Initialize click sound with error handling
      this.clickSound = new Audio('/audio/click.wav');
      this.clickSound.volume = 0.4;
      this.clickSound.onerror = () => {
        console.warn('Click sound file not found - using silent mode');
        this.sfxEnabled = false;
      };

      this.initialized = true;
      console.log('🎵 Audio system initialized (files may be missing)');
    } catch (error) {
      console.warn('Failed to initialize audio:', error);
      this.initialized = true; // Still mark as initialized for graceful degradation
    }
  }

  setVolume(volume) {
    this.volume = volume;
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = (volume / 100) * 0.3; // Max 30% for background
    }
    if (this.clickSound) {
      this.clickSound.volume = (volume / 100) * 0.4; // Max 40% for SFX
    }
  }

  setSfxEnabled(enabled) {
    this.sfxEnabled = enabled;
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (this.backgroundMusic) {
      if (enabled) {
        this.playBackgroundMusic();
      } else {
        this.backgroundMusic.pause();
      }
    }
  }

  async playBackgroundMusic() {
    if (!this.initialized || !this.musicEnabled || !this.backgroundMusic) return;

    try {
      // Check if already playing
      if (!this.backgroundMusic.paused) return;

      await this.backgroundMusic.play();
    } catch (error) {
      console.warn('Failed to play background music:', error);
    }
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  async playClickSound() {
    if (!this.initialized || !this.sfxEnabled || !this.clickSound) return;

    try {
      // Reset sound to beginning for rapid clicks
      this.clickSound.currentTime = 0;
      await this.clickSound.play();
    } catch (error) {
      console.warn('Failed to play click sound:', error);
    }
  }

  // Mock audio files creation - these would be replaced with real audio files
  static async createMockAudioFiles() {
    // This is a development helper - in production, real audio files would be used
    console.log('Mock audio system initialized - replace with real audio files');
    
    // You would place actual audio files in public/audio/:
    // - background-loop.mp3 (cyberpunk electronic loop)
    // - click.wav (digital click sound)
  }
}

export default AudioManager;
