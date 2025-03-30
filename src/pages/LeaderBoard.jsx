import React, { useState } from 'react'
import '../css/LeaderBoard.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LeaderBoard = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('NORMAL');

    const handleBackClick = () => {       
        navigate('/gamemenu');
      };

      const handleDifficultyChange = (e) => {
        setDifficulty(e.target.value);
        // Here you would typically fetch leaderboard data for the selected difficulty
        // For now, we'll just update the state
      };
      
    
      return (
        <div className="game-container-ldrb">
          {/* Dark overlay for the entire background */}
          <div className="background-overlay-ldrb"></div>
    
          {/* Fire/lava effect at the bottom */}
          <div className="fire-effect-ldrb"></div>
    
          {/* Header with user profile and back button */}
          <div className="header-ldrb">
            <div className="user-profile-ldrb">
              <div className="user-icon-ldrb">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
                <div className="user-tooltip-ldrb">
                  <h3>Player #01</h3>
                  <p>Rank: 1</p>
                  <p>Level: 5</p>
                  <p>Total Score: 000</p>
                  <p>Games Played: 10</p>
                </div>
              </div>
              <div className="user-name-ldrb">PLAYER #01</div>
            </div>
            <button className="back-button-ldrb" onClick={handleBackClick}>
              BACK
            </button>
          </div>
    
          {/* Leaderboard container */}
          <div className="leaderboard-container-ldrb">

            {/* Difficulty selector dropdown */}
        <div className="difficulty-selector-ldrb">
          <select 
            value={difficulty} 
            onChange={handleDifficultyChange}
            className="difficulty-dropdown-ldrb"
          >
            <option value="EASY">EASY</option>
            <option value="NORMAL">NORMAL</option>
            <option value="HARD">HARD</option>
          </select>
        </div>
            {/* Transparent black box for entries background */}
            <div className="entry-background-ldrb"></div>
    
            <div className="leaderboard-title-ldrb">LEADERBOARD</div>

             

            <div className="leaderboard-entries-ldrb">
              <div className="leaderboard-entry-ldrb">
                <div className="player-name-ldrb odd-player-ldrb">Player 001</div>
                <div className="player-score-ldrb score-yellow-ldrb">000</div>
              </div>
              <div className="leaderboard-entry-ldrb">
                <div className="player-name-ldrb even-player-ldrb">Player 002</div>
                <div className="player-score-ldrb score-red-ldrb">000</div>
              </div>
              <div className="leaderboard-entry-ldrb">
                <div className="player-name-ldrb odd-player-ldrb">Player 003</div>
                <div className="player-score-ldrb score-yellow-ldrb">000</div>
              </div>
              <div className="leaderboard-entry-ldrb">
                <div className="player-name-ldrb even-player-ldrb">Player 004</div>
                <div className="player-score-ldrb score-red-ldrb">000</div>
              </div>
              <div className="leaderboard-entry-ldrb">
                <div className="player-name-ldrb odd-player-ldrb">Player 005</div>
                <div className="player-score-ldrb score-yellow-ldrb">000</div>
              </div>
              <div className="leaderboard-entry-ldrb">
                <div className="player-name-ldrb even-player-ldrb">Player 006</div>
                <div className="player-score-ldrb score-red-ldrb">000</div>
              </div>
            </div>
          </div>
        </div>
      );
    };
export default LeaderBoard;
