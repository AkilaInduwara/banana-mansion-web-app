import React, { useState } from "react";
import "../css/RegisterPage.css";
import { auth, db } from "../firebaseConfig"; // Import Firebase Authentication and Firestore
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase Auth function
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import { Link } from "react-router-dom";

const RegisterPage = () => {
  
  // State for input fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Add user data to Firestore
      await addDoc(collection(db, "players_data"), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
      });

      alert("Registration successful!");

      // Reset form fields after registration
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error registering user: ", error);

      // Handle specific errors from Firebase
      if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters");
      } else if (error.code === "auth/email-already-in-use") {
        alert("Email is already in use");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email format");
      } else {
        alert("Registration failed. Please try again.");
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

        {/* Registration Form */}
        <form className="registration-form" onSubmit={handleRegister}>
          <input
            type="text"
            className="input-field"
            placeholder="Enter Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
          <input
            type="password"
            className="input-field"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="register-button">
            REGISTER
          </button>
        </form>

        {/* Login Link */}
        <div className="login-container">
          <div className="login-text">Already have an account?</div>
          <Link to="/login" className="login-link">
            LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
