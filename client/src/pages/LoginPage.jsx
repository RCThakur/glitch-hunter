import React, { useState } from "react";
import LoginModal from "../components/LoginModal"; // Make sure this path is correct
import AudioManager from "../utils/AudioManager";

export default function LoginPage({ onLoginSuccess }) {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const audioManager = new AudioManager();

  const handleLogin = async (username, password) => {
    // Here you call your server login API
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data); // Pass user data to parent (App.jsx)
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        audioManager={audioManager}
      />
    </div>
  );
}
