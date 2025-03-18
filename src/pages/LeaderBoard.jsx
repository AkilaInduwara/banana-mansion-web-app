import React from 'react'
import '../css/LeaderBoard.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LeaderBoard = () => {
  const navigate = useNavigate();
    const handleBackClick = () => {
        alert('Going back to the main menu!');
        navigate('/gamemenu');
      };
    
      return (
        <div className="game-container">
          {/* Dark overlay for the entire background */}
          <div className="background-overlay"></div>
    
          {/* Fire/lava effect at the bottom */}
          <div className="fire-effect"></div>
    
          {/* Header with user profile and back button */}
          <div className="header">
            <div className="user-profile">
              <div className="user-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
                <div className="user-tooltip">
                  <h3>Player #01</h3>
                  <p>Rank: 1</p>
                  <p>Level: 5</p>
                  <p>Total Score: 000</p>
                  <p>Games Played: 10</p>
                </div>
              </div>
              <div className="user-name">PLAYER #01</div>
            </div>
            <button className="back-button" onClick={handleBackClick}>
              BACK
            </button>
          </div>
    
          {/* Leaderboard container */}
          <div className="leaderboard-container">
            {/* Transparent black box for entries background */}
            <div className="entry-background"></div>
    
            <div className="leaderboard-title">LEADERBOARD</div>
            <div className="leaderboard-entries">
              <div className="leaderboard-entry">
                <div className="player-name odd-player">Player 001</div>
                <div className="player-score score-yellow">000</div>
              </div>
              <div className="leaderboard-entry">
                <div className="player-name even-player">Player 002</div>
                <div className="player-score score-red">000</div>
              </div>
              <div className="leaderboard-entry">
                <div className="player-name odd-player">Player 003</div>
                <div className="player-score score-yellow">000</div>
              </div>
              <div className="leaderboard-entry">
                <div className="player-name even-player">Player 004</div>
                <div className="player-score score-red">000</div>
              </div>
              <div className="leaderboard-entry">
                <div className="player-name odd-player">Player 005</div>
                <div className="player-score score-yellow">000</div>
              </div>
              <div className="leaderboard-entry">
                <div className="player-name even-player">Player 006</div>
                <div className="player-score score-red">000</div>
              </div>
            </div>
          </div>
        </div>
      );
    };
export default LeaderBoard;
