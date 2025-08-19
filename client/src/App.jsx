import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [user, setUser] = useState(null); // Store logged-in user

  return (
    <div className="App w-full min-h-screen overflow-hidden bg-black">
      {currentPage === "landing" && (
        <LandingPage
          onLoadingComplete={() => setCurrentPage("login")}
        />
      )}

      {currentPage === "login" && (
        <LoginPage
          onLoginSuccess={(userData) => {
            setUser(userData);
            setCurrentPage("dashboard");
          }}
        />
      )}

      {currentPage === "dashboard" && <Dashboard user={user} />}
    </div>
  );
}

export default App;
