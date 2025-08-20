import React, { useState } from "react";
import LoginModal from "../components/LoginModal";
import AudioManager from "../utils/AudioManager";

export default function LoginPage({ onLoginSuccess }) {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const audioManager = new AudioManager();

  const handleLogin = async (username, password) => {
    // Test credentials
    if (username === "test" && password === "1234") {
      const fakeUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
      };
      onLoginSuccess(fakeUser);
      return true;
    } else {
      alert("Invalid test credentials! Use test / 1234");
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
