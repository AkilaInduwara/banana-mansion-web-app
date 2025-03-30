import React, { useState, useEffect, useRef } from 'react'
import '../css/GameplayPage.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';

const GameplayPage = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(45);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState([1, 1, 1, 1, 1]);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [solution, setSolution] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const scoreDisplayRef = useRef(null);
  const timerRef = useRef(null);
  const heartsRef = useRef([]);

  // Fetch the first image when the component is mounted
  useEffect(() => {
    fetchQuestion();
  }, []);

  // Function to fetch question from API
  const fetchQuestion = async () => {
    setIsImageLoaded(false);
    try {
      const response = await fetch('https://marcconrad.com/uob/banana/api.php');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      console.log('API Response:', data);
      
      if (!data.question) {
        throw new Error('No question data received');
      }

      setImageUrl(data.question);
      setSolution(data.solution);
      setHasStarted(true);
    } catch (error) {
      console.error('Error fetching question:', error);
      setTimeout(fetchQuestion, 2000);
    }
  };

    // Countdown timer logic
    useEffect(() => {
      const timerInterval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 0) {
            handleTimeUp();
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
  
      return () => clearInterval(timerInterval);
    }, [lives]); // Add lives to dependency array to handle updates
  
    // Handle time running out
    const handleTimeUp = () => {
      const newLives = [...lives];
      let lifeLost = false;
      
      // Deduct a life if available
      for (let i = newLives.length - 1; i >= 0; i--) {
        if (newLives[i] === 1) {
          newLives[i] = 0;
          lifeLost = true;
          break;
        }
      }
      
      setLives(newLives);
  
      if (newLives.every((life) => life === 0)) {
        alert('Game Over!');
        resetGame();
      } else if (lifeLost) {
        // Only reset timer if a life was actually lost
        setSeconds(45); // Reset to 45 seconds for next attempt
        // Question remains the same until correct answer
      }
    };

  // Pulse effect for score display
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      if (scoreDisplayRef.current) {
        scoreDisplayRef.current.style.textShadow = '2px 2px 4px #FFD700, -2px 2px 4px #FFD700, 2px -2px 4px #FFD700, -2px -2px 4px #FFD700';
        setTimeout(() => {
          scoreDisplayRef.current.style.textShadow = '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000';
        }, 500);
      }
    }, 1000);

    return () => clearInterval(pulseInterval);
  }, []);

  // Timer color change when below 10 seconds
  useEffect(() => {
    if (seconds <= 15) {
      timerRef.current.style.animation = 'pulseGlowRed 1s ease-in-out infinite';
      timerRef.current.style.color = '#FF0000';
    } else {
      timerRef.current.style.animation = 'none';
      timerRef.current.style.color = '#FFFFFF';
    }
  }, [seconds]);

  // Heart pulse effect
  useEffect(() => {
    heartsRef.current.forEach((heart, index) => {
      heart.style.animation = `pulseGlowRed 2s ease-in-out ${index * 0.2}s infinite`;
    });
  }, []);

   // Handle number button click
   const handleNumberClick = (number) => {
    const button = document.querySelector(`.number-button-gplay:nth-child(${number + 1})`);
    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 100);

    checkAnswer(number);
    createParticles(button.getBoundingClientRect(), '#FFD700');
  };

  // Check if the answer is correct
  const checkAnswer = (answer) => {
    if (answer === solution) {
      setScore((prevScore) => prevScore + 10);
      setSeconds(45); // Reset timer on correct answer
      setIsImageLoaded(false);
      fetchQuestion(); // Only fetch new question on correct answer
    } else {
      const newLives = [...lives];
      for (let i = newLives.length - 1; i >= 0; i--) {
        if (newLives[i] === 1) {
          newLives[i] = 0;
          break;
        }
      }
      setLives(newLives);

      if (newLives.every((life) => life === 0)) {
        alert('Game Over!');
        resetGame();
      }
    }
  };

  // Reset the game
  const resetGame = () => {
    navigate('/gamemenu');
  };

  // Toggle sound
  const toggleSound = () => {
    setIsSoundOn((prev) => !prev);
    console.log('Sound toggled');
  };

  // Create particles animation
  const createParticles = (rect, color) => {
    const particleCount = 15;
    const container = document.querySelector('.game-container-gplay');

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '8px';
      particle.style.height = '8px';
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = color;
      particle.style.left = `${rect.left + rect.width / 2}px`;
      particle.style.top = `${rect.top + rect.height / 2}px`;
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1000';

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      container.appendChild(particle);

      let posX = rect.left + rect.width / 2;
      let posY = rect.top + rect.height / 2;
      let opacity = 1;
      let size = 8;

      const particleInterval = setInterval(() => {
        posX += vx;
        posY += vy;
        opacity -= 0.05;
        size -= 0.2;

        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = opacity;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        if (opacity <= 0) {
          clearInterval(particleInterval);
          particle.remove();
        }
      }, 20);
    }
  };

  return (
    <div className="game-container-gplay">
      <div className="background-overlay-gplay"></div>
      <div className="fire-effect-gplay"></div>

      <div className="top-nav-gplay">
        <div>
          <div className="user-info-gplay">
            <div className="user-logo-gplay">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                width="24"
                height="24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </div>
            <div className="user-name-gplay">PLAYER 621</div>
          </div>
          <div className="life-bar-gplay">
            {lives.map((life, index) => (
              <div key={index} className="heart-gplay" ref={(el) => (heartsRef.current[index] = el)}>
                {life === 1 ? '❤️' : '🖤'}
              </div>
            ))}
          </div>
        </div>
        <button className="quit-button-gplay" onClick={resetGame}>
          QUIT
        </button>
      </div>

      <div className="game-content-gplay">
        <div className="game-screen-gplay">
        <div className="game-display-gplay">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Math puzzle"
                onLoad={() => {
                  console.log('Image loaded successfully:', imageUrl);
                  setIsImageLoaded(true)}}
                onError={(e) => {
                  console.error('Failed to load image',imageUrl, e);
                  setIsImageLoaded(false);
                  fetchQuestion();
                }}
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  display: isImageLoaded ? 'block' : 'none' 
                }}
              />
            ) : (
              <div className="loading-placeholder">
                Loading puzzle...
              </div>
        )}        
      </div>
      
        </div>
        <div className="timer-gplay" ref={timerRef}>
          {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
        </div>

        <div className="number-buttons-gplay">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="number-button-gplay"
              onClick={() => handleNumberClick(index)}
            >
              {index}
            </div>
          ))}
        </div>

        <div className="score-display-gplay" ref={scoreDisplayRef}>
          score : {String(score).padStart(3, '0')}
        </div>
      </div>

      <div className="sound-control-gplay" onClick={toggleSound}>
        <div className="sound-icon-gplay">
          {isSoundOn ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              width="24"
              height="24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              width="24"
              height="24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-11.5 0c0 3.53 2.61 6.43 6 6.92v-2.08c-2.01-.44-3.5-2.25-3.5-4.39s1.49-3.95 3.5-4.39v-2.08c-3.39.49-6 3.39-6 6.92zm3.5 0c0 1.44 1.06 2.65 2.5 2.92V9.08c-1.44.27-2.5 1.48-2.5 2.92zm7.5-12v24h-1v-24h1z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameplayPage;