import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Start_Page from './pages/start_Page'; // Import Start_Page
import LoginPage from './pages/LoginPage.jsx'; // Import LoginPage
import GameMenu from './pages/gamemenu_Page.jsx'; // Import GameMenu
import RegisterPage from './pages/register_Page.jsx';
import Gameplay_Page from './pages/gameplay_Page.jsx';
import ModePage from './pages/mode_Page.jsx';
import LeaderBoard from './pages/leaderboard_Page.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Start_Page />} />
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/gamemenu" element={<GameMenu />} /> 
          <Route path="/register" element={<RegisterPage />} /> 
          <Route path="/gameplay" element={<Gameplay_Page />} /> 
          <Route path="/mode" element={<ModePage />} /> 
          <Route path="/leader" element={<LeaderBoard />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;