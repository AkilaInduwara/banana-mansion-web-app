import React, { useState } from 'react'
import '../css/login_Page.css'
import { auth } from "../firebaseConfig"; // Import Firebase Authentication
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase Auth function

const login_Page = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Use Firebase Authentication to sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      alert("Login successful! Welcome back to Banana Mansion!");

      // Redirect user to the game or dashboard page (e.g., using React Router)
      // Example: history.push('/dashboard');

    } catch (error) {
      console.error("Error logging in: ", error);

      // Handle specific errors from Firebase Authentication
      if (error.code === 'auth/wrong-password') {
        alert("Incorrect password. Please try again.");
      } else if (error.code === 'auth/user-not-found') {
        alert("User not found. Please check your email or sign up.");
      } else if (error.code === 'auth/invalid-email') {
        alert("Invalid email format.");
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="game-container">
      {/* Background Overlay */}
      <div className="background-overlay"></div>

      {/* Fire/lava effect */}
      <div className="fire-effect"></div>

      {/* Semi-transparent black card */}
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
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Enter Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
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
