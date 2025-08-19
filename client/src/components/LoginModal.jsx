import React, { useState } from 'react';
import { X, User, Lock, Eye, EyeOff } from 'lucide-react';
import GlitchButton from './GlitchButton';
import '../styles/glitch.css';

const LoginModal = ({ isOpen, onClose, onLogin, audioManager }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await onLogin(formData.username, formData.password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setError('Login failed. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    audioManager?.playClickSound();
    setFormData({ username: '', password: '' });
    setError('');
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
      <div className="relative bg-gray-900 border-2 border-purple-500 rounded-lg p-8 w-full max-w-md mx-4 glitch-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-purple-400 glitch-text" data-text="LOGIN">
            LOGIN
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white font-bold">
              <User className="w-5 h-5 text-purple-400" />
              USERNAME
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your hunter callsign"
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded font-mono text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white font-bold">
              <Lock className="w-5 h-5 text-purple-400" />
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your access code"
                className="w-full px-4 py-3 pr-12 bg-gray-800 border-2 border-gray-600 rounded font-mono text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 border border-red-500 rounded p-3 text-red-200 text-center">
              {error}
            </div>
          )}

          {/* Demo Credentials Info */}
          <div className="bg-gray-800 border border-cyan-500 rounded p-4 text-sm">
            <div className="text-cyan-400 font-bold mb-2">DEMO CREDENTIALS:</div>
            <div className="font-mono text-gray-300 space-y-1">
              <div>Username: <span className="text-cyan-400">demo_hunter</span></div>
              <div>Password: <span className="text-cyan-400">glitch123</span></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <GlitchButton
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400"
              glitchColor="purple"
              disabled={isLoading}
            >
              {isLoading ? 'CONNECTING...' : 'LOGIN'}
            </GlitchButton>
            <GlitchButton
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
              glitchColor="gray"
              disabled={isLoading}
            >
              CANCEL
            </GlitchButton>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          New hunter? <span className="text-purple-400 cursor-pointer hover:text-purple-300">Register here</span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;