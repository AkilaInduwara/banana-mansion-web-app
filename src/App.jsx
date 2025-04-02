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
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

function App() {
  return (
    <AudioProvider>
      <Router>
        <div className="App">
          <UserProvider>
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/gamemenu"
                element={
                  <ProtectedRoute>
                    <GameMenu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gameplay"
                element={
                  <ProtectedRoute>
                    <GameplayPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mode"
                element={
                  <ProtectedRoute>
                    <ModePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leader"
                element={
                  <ProtectedRoute>
                    <LeaderBoard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </UserProvider>
        </div>
      </Router>
    </AudioProvider>
  );
}

export default App;
