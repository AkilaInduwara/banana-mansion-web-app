import React from 'react'
import '../css/mode_Page.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';

const mode_Page = () => {
  const navigate = useNavigate();
    const handleModeClick = (mode) => {
        alert(`${mode} mode selected!`);

        const routeMap = {
          'HARD': '/mode',
          'NORMAL': '/gameplay',
          'EASY': '/leader',
          
          // Add more buttons and their corresponding routes here
        }
      
    
        // Navigate to the corresponding route
        if (routeMap[buttonName]) {
          navigate(routeMap[buttonName]);
        } else {
          alert('No route defined for this button!');
        }
      };
    
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
                  {/* Banana detective character SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 300 400"
                    width="90%"
                    height="90%"
                  >
                    {/* Banana body */}
                    <ellipse cx="150" cy="200" rx="70" ry="150" fill="#FFD700" stroke="#000" strokeWidth="3" />
                    {/* Hat */}
                    <ellipse cx="150" cy="90" rx="45" ry="10" fill="#8B4513" stroke="#000" strokeWidth="2" />
                    <rect x="120" y="55" width="60" height="35" fill="#8B4513" stroke="#000" strokeWidth="2" />
                    {/* Face */}
                    <circle cx="170" cy="145" r="8" fill="#000" /> {/* Eye */}
                    <path d="M130 160 Q150 180 170 160" fill="none" stroke="#000" strokeWidth="2" /> {/* Smile */}
                    {/* Magnifying glass */}
                    <circle cx="220" cy="220" r="25" fill="none" stroke="#000" strokeWidth="4" />
                    <rect x="235" y="235" width="50" height="10" rx="5" transform="rotate(45, 235, 235)" fill="#000" />
                    {/* Arms */}
                    <path d="M90 180 C 60 170, 50 200, 30 190" fill="none" stroke="#000" strokeWidth="3" />
                    <path d="M200 180 C 215 160, 230 170, 235 175" fill="none" stroke="#000" strokeWidth="3" />
                    {/* Legs */}
                    <path d="M120 330 C 100 370, 90 380, 80 390" fill="none" stroke="#000" strokeWidth="3" />
                    <path d="M180 330 C 200 370, 210 380, 220 390" fill="none" stroke="#000" strokeWidth="3" />
                    {/* Shoes */}
                    <ellipse cx="75" cy="395" rx="15" ry="5" fill="#8B4513" stroke="#000" strokeWidth="2" />
                    <ellipse cx="225" cy="395" rx="15" ry="5" fill="#8B4513" stroke="#000" strokeWidth="2" />
                  </svg>
                </div>
              </div>
    
              {/* Game mode buttons */}
              <div className="mode-container">
                <button className="mode-button" onClick={() => handleModeClick('EASY')}>
                  EASY
                </button>
                <button className="mode-button" onClick={() => handleModeClick('NORMAL')}>
                  NORMAL
                </button>
                <button className="mode-button" onClick={() => handleModeClick('HARD')}>
                  HARD
                </button>
                <button className="back-button" onClick={handleBackClick}>
                  BACK
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };

export default mode_Page
