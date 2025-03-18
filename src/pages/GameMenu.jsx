import React from 'react'
import '../css/GameMenu.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';

const gamemenu_Page = () => {
  const navigate = useNavigate();

  
    const handleButtonClick = (buttonName) => {
        alert(`${buttonName} clicked!`);
        
        const routeMap = {
          'MODE': '/mode',
          'PLAY': '/gameplay',
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
        <div className="game-container">
          {/* Dark overlay for the entire background */}
          <div className="background-overlay"></div>
    
          {/* Fire/lava effect at the bottom */}
          <div className="fire-effect"></div>
    
          {/* Semi-transparent black card in the center */}
          <div className="black-card">
            {/* User profile icon */}
            <div className="user-profile">
              <div className="user-icon">
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
            <div className="title-container">
              <div className="title-text">
                <div className="banana-text">BANANA</div>
                <div className="mansion-text">MANSION</div>
              </div>
            </div>
    
            {/* Content container */}
            <div className="content-container">
              {/* Banana detective character */}
              <div className="banana-detective-container">
                <div className="banana-detective">
                  {/* Add the banana detective image here */}
                </div>
              </div>
    
              {/* Menu buttons */}
              <div className="menu-container">
              <button
          className="menu-button"
          onClick={() => handleButtonClick('PLAY')}
        >
          PLAY
        </button>
                <button
                  className="menu-button"
                  onClick={() => handleButtonClick('MODE')}
                >
                  MODE
                </button>
                <button
                  className="menu-button"
                  onClick={() => handleButtonClick('LEADERBOARD')}
                >
                  LEADERBOARD
                </button>
                <button
                  className="menu-button"
                  onClick={() => handleButtonClick('SIGN OUT')}
                >
                  SIGN OUT
                </button>
                <button
                  className="menu-button"
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

export default gamemenu_Page
