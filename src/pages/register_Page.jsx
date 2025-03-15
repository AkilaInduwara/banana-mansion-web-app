import React from 'react'
import '../css/register_Page.css'

const register_Page = () => {
    const handleRegister = (e) => {
        e.preventDefault();
        alert('Registration successful! Welcome to Banana Mansion!');
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
    
            {/* Registration form */}
            <form className="registration-form" onSubmit={handleRegister}>
              <input
                type="text"
                className="input-field"
                placeholder="Enter Name"
                required
              />
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
              <input
                type="password"
                className="input-field"
                placeholder="Confirm Password"
                required
              />
    
              <button type="submit" className="register-button">
                REGISTER
              </button>
            </form>
    
            {/* Login link */}
            <div className="login-container">
              <div className="login-text">Already have an account?</div>
              <a href="#" className="login-link">
                LOGIN
              </a>
            </div>
          </div>
        </div>
      );
    };

export default register_Page
