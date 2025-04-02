import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { UserProvider } from "./services/UserContext.jsx"; // Import UserProvider for context
import { AudioProvider } from "./context/AudioContext"; // Import AudioProvider for context
import StartPage from "./pages/StartPage.jsx"; // Import Start_Page
import LoginPage from "./pages/LoginPage.jsx"; // Import LoginPage
import GameMenu from "./pages/GameMenu.jsx"; // Import GameMenu
import RegisterPage from "./pages/RegisterPage.jsx";
import GameplayPage from "./pages/GameplayPage.jsx";
import ModePage from "./pages/ModePage.jsx";
import LeaderBoard from "./pages/LeaderBoard.jsx";

function App() {
  return (
    <AudioProvider>
      <Router>
        <div className="App">
          <UserProvider>
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/gamemenu" element={<GameMenu />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/gameplay" element={<GameplayPage />} />
              <Route path="/mode" element={<ModePage />} />
              <Route path="/leader" element={<LeaderBoard />} />
            </Routes>
          </UserProvider>
        </div>
      </Router>
    </AudioProvider>
  );
}

export default App;
