import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import GamePage from "./pages/GamePage";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [user, setUser] = useState(null);

  return (
    <div className="w-full min-h-screen bg-black text-white font-sans">
      {currentPage === "landing" && (
        <LandingPage onLoadingComplete={() => setCurrentPage("login")} />
      )}

      {currentPage === "login" && (
        <LoginPage
          onLoginSuccess={(userData) => {
            setUser(userData);
            setCurrentPage("dashboard");
          }}
          onBack={() => setCurrentPage("landing")}
        />
      )}

      {currentPage === "dashboard" && (
        <Dashboard user={user} onLogout={() => setCurrentPage("login")} />
      )}

      {currentPage === "game" && (
        <GamePage user={user} />
      )}
    </div>
  );
}

export default App;
