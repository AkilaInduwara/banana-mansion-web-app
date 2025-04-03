import React, { useState, useRef } from "react";
import "../css/RegisterPage.css";
import { auth, db } from "../firebaseConfig"; // Import Firebase Authentication and Firestore
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase Auth function
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import { Link, useNavigate } from "react-router-dom";


//Audio imports
import buttonClick from '../assets/audio/button_click.mp3';
import linkClick from '../assets/audio/link_click.mp3';
import hoverSound from '../assets/audio/button_hover.mp3';

const RegisterPage = () => {
  const navigate = useNavigate(); // Initialize the navigation hook
  const [error, setError] = useState(""); // Add error state
  
  
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
    setError(""); // Reset error message before validation


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

      // Store user authentication state in localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userName", formData.name);

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
        setError("Password should be at least 6 characters");
      } else if (error.code === "auth/email-already-in-use") {
        setError("Email is already in use");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format");
      } else {
        setError("Registration failed. Please try again.");
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
          <button type="submit" className="register-button-reg"
          onMouseEnter={handleHover}
          onClick={handleClick}>
            REGISTER
          </button>
        </form>

        {error && <div className="error-message-reg">{error}</div>}

        {/* Login Link */}
        <div className="login-container-reg">
          <div className="login-text-reg">Already have an account?</div>
          <Link to="/login" className="login-link-reg"
          onMouseEnter={handleHover}
          onClick={handleClick}>
            LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
