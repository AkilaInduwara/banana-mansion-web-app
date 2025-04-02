import React, { useState, useRef, useEffect } from "react";
import "../css/LoginPage.css";
import { auth } from "../firebaseConfig"; // Import Firebase Authentication
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase Auth function
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";

//Audio imports
import linkClick from '../assets/audio/link_click.mp3';
import buttonClick from '../assets/audio/button_click.mp3';
import hoverSound from '../assets/audio/button_hover.mp3';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // State for handling error messages
  const navigate = useNavigate(); // Initialize the navigation hook

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message before trying to log in
    try {
      // Use Firebase Authentication to sign in the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Store user authentication state in localStorage
      localStorage.setItem("isAuthenticated", "true");

      // Redirect user to the dashboard or home page
      navigate('/gamemenu', { 
        state: { 
          userName: user.displayName || user.email.split('@')[0] 
        } 
      });
    } 
    catch (error) {
      console.error("Error logging in: ", error);

      // Handle specific errors from Firebase Authentication
      if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        setError("User not found. Please check your email or sign up.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  // Create a ref for the audio
  const clickSoundRef = useRef(null);
  const linkSoundRef = useRef(null);
  const hoverSoundRef = useRef(null);


 // Initialize audio when component mounts
 React.useEffect(() => {
  clickSoundRef.current = new Audio(buttonClick);
  linkSoundRef.current = new Audio(linkClick);
  hoverSoundRef.current = new Audio(hoverSound);

  // Preload sounds
  [clickSoundRef, linkSoundRef, hoverSoundRef].forEach(ref => {
    ref.current.volume = 0.7; // Set comfortable volume level
    ref.current.load();
  });

  return () => {
    // Clean up audio elements
    [clickSoundRef, linkSoundRef, hoverSoundRef].forEach(ref => {
      if (ref.current) {
        ref.current.pause();
        ref.current = null;
      }
    });
  };
}, []);


//handle Audio effects
const handleLinkClick = (e) => {
  if (linkSoundRef.current) {
    // Clone the audio element to allow multiple rapid plays
    const audioClone = new Audio(linkClick);
    audioClone.play()
      .then(() => {
        // Clean up after playback completes
        setTimeout(() => {
          audioClone.remove();
        }, 1000);
      })
      .catch(err => {
        console.log("Audio playback error:", err);
        audioClone.remove();
      });
  }
};

const handleClick = (e) => {
  if (clickSoundRef.current) {
    // Clone the audio element to allow multiple rapid plays
    const audioClone = new Audio(buttonClick);
    audioClone.play()
      .then(() => {
        // Clean up after playback completes
        setTimeout(() => {
          audioClone.remove();
        }, 1000);
      })
      .catch(err => {
        console.log("Audio playback error:", err);
        audioClone.remove();
      });
  }
};

const handleHover = (e) => {
  if (hoverSoundRef.current) {
    // Clone the audio element to allow multiple rapid plays
    const audioClone = new Audio(hoverSound);
    audioClone.play()
      .then(() => {
        // Clean up after playback completes
        setTimeout(() => {
          audioClone.remove();
        }, 1000);
      })
      .catch(err => {
        console.log("Audio playback error:", err);
        audioClone.remove();
      });
  }};


  return (
    <div className="game-container-login">
      {/* Background Overlay */}
      <div className="background-overlay-login"></div>

      {/* Fire/lava effect */}
      <div className="fire-effect-login"></div>

      {/* Semi-transparent black card */}
      <div className="black-card-login">
        <div className="title-container-login">
          <div className="title-text-login">
            <div className="banana-text-login">BANANA</div>
            <div className="mansion-text-login">MANSION</div>
          </div>
        </div>

        {/* Login Form */}
        <form className="login-form-login" onSubmit={handleLogin}>
          <input
            type="email"
            className="input-field-login"
            placeholder="Enter Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="input-field-login"
            placeholder="Enter Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" 
          className="login-button-login"
          onMouseEnter={handleHover}
          onClick={handleClick}>
            LOGIN
          </button>
        </form>

        {/* Error Message */}
        {error && <div className="error-message-login">{error}</div>}

        {/* Signup Link */}
        <div className="signup-container-login">
          <div className="signup-text-login">Don't Have an Account?</div>
          <Link to="/register" className="signup-link-login"
          onMouseEnter={handleHover}
          onClick={handleClick}>
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
