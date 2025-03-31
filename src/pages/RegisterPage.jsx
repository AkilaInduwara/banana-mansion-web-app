import React, { useState } from "react";
import "../css/RegisterPage.css";
import { auth, db } from "../firebaseConfig"; // Import Firebase Authentication and Firestore
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase Auth function
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate(); // Initialize the navigation hook
  
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
        createdAt: new Date(),
      });

      alert("Registration successful!");

      navigate('/gamemenu', { 
        state: { 
          userName: formData.name 
        } 
      }); // Redirect to game menu after successful registration

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
    <div className="game-container-reg">
      {/* Background Overlay */}
      <div className="background-overlay-reg"></div>

      {/* Fire/lava effect */}
      <div className="fire-effect-reg"></div>

      {/* Semi-transparent black card */}
      <div className="black-card-reg">
        <div className="title-container-reg">
          <div className="title-text-reg">
            <div className="banana-text-reg">BANANA</div>
            <div className="mansion-text-reg">MANSION</div>
          </div>
        </div>

        {/* Registration Form */}
        <form className="registration-form-reg" onSubmit={handleRegister}>
          <input
            type="text"
            className="input-field-reg"
            placeholder="Enter Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            className="input-field-reg"
            placeholder="Enter Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="input-field-reg"
            placeholder="Enter Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="input-field-reg"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="register-button-reg">
            REGISTER
          </button>
        </form>

        {/* Login Link */}
        <div className="login-container-reg">
          <div className="login-text-reg">Already have an account?</div>
          <Link to="/login" className="login-link-reg">
            LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
