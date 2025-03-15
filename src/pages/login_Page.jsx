import React from 'react'
import '../css/login_Page.css'

const login_Page = () => {
    const handleLogin = (e) => {
        e.preventDefault();
        alert('Login functionality to be implemented!');
      };
    
      return (
        <div className="game-container">
          {/* Dark overlay for the entire background */}
          <div className="background-overlay"></div>
    
          {/* Fire/lava effect at the bottom */}
          <div className="fire-effect"></div>
    
          {/* Semi-transparent black card in the center */}
          <div className="black-card">
            <div className="title-container">
              <div className="title-text">
                <div className="banana-text">BANANA</div>
                <div className="mansion-text">MANSION</div>
              </div>
            </div>
    
            {/* Login Form */}
            <form className="login-form" onSubmit={handleLogin}>
              <input
                type="email"
                className="input-field"
                placeholder="Enter Email"
                required
              />
              <input
                type="password"
                className="input-field"
                placeholder="Enter Password"
                required
              />
              <button type="submit" className="login-button">
                LOGIN
              </button>
            </form>
    
            {/* Signup Link */}
            <div className="signup-container">
              <div className="signup-text">Don't Have an Account?</div>
              <a href="#" className="signup-link">
                SIGN UP
              </a>
            </div>
          </div>
        </div>
      );
    };
    

export default login_Page
