import React from 'react'
import '../css/GameMenu.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';

const GameMenu = () => {
  const navigate = useNavigate();

  
    const handleButtonClick = (buttonName) => {
        
        
        const routeMap = {
          'MODE': '/mode',
          'PLAY': '/mode',
          'LEADERBOARD': '/leader',
          'SIGN OUT': '/login',
          'QUIT': '/',
          // Add more buttons and their corresponding routes here
        }
      
    
        // Navigate to the corresponding route
        if (routeMap[buttonName]) {
          navigate(routeMap[buttonName]);
        } else {
          alert('No route defined for this button!');
        }
      };
     

      return (
        <div className="game-container-gmenu">
          {/* Dark overlay for the entire background */}
          <div className="background-overlay-gmenu"></div>
    
          {/* Fire/lava effect at the bottom */}
          <div className="fire-effect-gmenu"></div>
    
          {/* Semi-transparent black card in the center */}
          <div className="black-card-gmenu">
            {/* User profile icon */}
            <div className="user-profile-gmenu">
              <div className="user-icon-gmenu">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  width="36"
                  height="36"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </div>
            </div>
    
            {/* Title */}
            <div className="title-container-gmenu">
              <div className="title-text-gmenu">
                <div className="banana-text-gmenu">BANANA</div>
                <div className="mansion-text-gmenu">MANSION</div>
              </div>
            </div>
    
            {/* Content container */}
            <div className="content-container-gmenu">
              {/* Banana detective character */}
              <div className="banana-detective-container-gmenu">
                <div className="banana-detective-gmenu">
                  {/* Add the banana detective image here */}
                </div>
              </div>
    
              {/* Menu buttons */}
              <div className="menu-container-gmenu">
              <button
          className="menu-button-gmenu"
          onClick={() => handleButtonClick('PLAY')}
        >
          PLAY
        </button>
                <button
                  className="menu-button-gmenu"
                  onClick={() => handleButtonClick('MODE')}
                >
                  MODE
                </button>
                <button
                  className="menu-button-gmenu"
                  onClick={() => handleButtonClick('LEADERBOARD')}
                >
                  LEADERBOARD
                </button>
                <button
                  className="menu-button-gmenu"
                  onClick={() => handleButtonClick('SIGN OUT')}
                >
                  SIGN OUT
                </button>
                <button
                  className="menu-button-gmenu"
                  onClick={() => handleButtonClick('QUIT')}
                >
                  QUIT
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    
      };

export default GameMenu;
