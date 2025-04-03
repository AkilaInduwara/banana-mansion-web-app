import React, { useState, useEffect, useRef } from "react";
import "../css/GameplayPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

//Audio imports
import buttonClick from "../assets/audio/button_click.mp3";
import linkClick from "../assets/audio/link_click.mp3";
import hoverSound from "../assets/audio/button_hover.mp3";
import hoverSound2 from "../assets/audio/hover_sound-2.mp3";
import correctAnswer from "../assets/audio/correct_answer.mp3";
import wrongAnswer from "../assets/audio/wrong_answer.mp3";
import gameOver from "../assets/audio/loser-horn.mp3";
import victorySound from "../assets/audio/victory-tri.mp3";
import loseSound from "../assets/audio/lose-tri.mp3";

const GameplayPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || "NORMAL";
  const [loading, setLoading] = useState(true);
  const [playerName, setPlayerName] = useState("PLAYER");
  const [error, setError] = useState(null);
  const [showSecondChanceModal, setShowSecondChanceModal] = useState(false);
  const [inTriviaChallenge, setInTriviaChallenge] = useState(false);
  const [triviaQuestions, setTriviaQuestions] = useState([]);
  const [currentTriviaIndex, setCurrentTriviaIndex] = useState(0);
  const [triviaTimer, setTriviaTimer] = useState(15);
  const [correctTriviaAnswers, setCorrectTriviaAnswers] = useState(0);
  const [usedSecondChance, setUsedSecondChance] = useState(false);
  const [mainGamePaused, setMainGamePaused] = useState(false);
  const [showTriviaResults, setShowTriviaResults] = useState(false);
  const [currentShuffledAnswers, setCurrentShuffledAnswers] = useState([]);

  

  const shuffleAnswers = (incorrectAnswers, correctAnswer) => {
    const answers = [...incorrectAnswers, correctAnswer];
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers;
  };

  const saveScoreToFirestore = async (finalScore) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // First get the player's name
      const playerQuery = query(
        collection(db, "players_data"),
        where("uid", "==", user.uid)
      );
      const playerSnapshot = await getDocs(playerQuery);

      let playerName = "Anonymous";
      if (!playerSnapshot.empty) {
        playerName =
          playerSnapshot.docs[0].data().name ||
          user.email?.split("@")[0] ||
          "Anonymous";
      }

      // Determine which leaderboard to use based on game mode
      const leaderboardName = `leaderboard_${mode.toLowerCase()}`;
      const leaderboardRef = collection(db, leaderboardName);

      // Add the new score
      await addDoc(leaderboardRef, {
        userId: user.uid,
        name: playerName,
        score: finalScore,
        timestamp: serverTimestamp(),
      });

      console.log("Score saved to", leaderboardName);
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  // Function to shuffle an array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };


  // Trivia timer countdown effect
useEffect(() => {
  let triviaInterval;
  
  if (inTriviaChallenge && triviaQuestions.length > 0) {
    triviaInterval = setInterval(() => {
      setTriviaTimer(prev => {
        if (prev <= 0) {
          handleTriviaTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return () => {
    if (triviaInterval) clearInterval(triviaInterval);
  };
}, [inTriviaChallenge, triviaQuestions.length, currentTriviaIndex]);



  useEffect(() => {
    // Set up auth state observer
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);

        if (user) {
          // User is signed in
          const q = query(
            collection(db, "players_data"),
            where("uid", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const playerData = querySnapshot.docs[0].data();
            setPlayerName(playerData.name || "PLAYER");
          } else {
            console.log("No player data found");
            setPlayerName("PLAYER");
          }
        } else {
          // User is signed out
          setPlayerName("PLAYER");
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
        setError("Failed to load player name. Please refresh.");
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  // Initialize game settings based on mode
  const getInitialSettings = () => {
    switch (mode) {
      case "EASY":
        return { timer: 30, lives: [1, 1, 1, 1, 1] }; // 5 lives
      case "NORMAL":
        return { timer: 25, lives: [1, 1, 1, 1] }; // 4 lives
      case "HARD":
        return { timer: 20, lives: [1, 1, 1] }; // 3 lives
      default:
        return { timer: 25, lives: [1, 1, 1, 1] }; // Default to NORMAL
    }
  };

  const initialSettings = getInitialSettings();
  const [seconds, setSeconds] = useState(initialSettings.timer);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(initialSettings.lives);
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
      const response = await fetch("https://marcconrad.com/uob/banana/api.php");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      console.log("API Response:", data);

      if (!data.question) {
        throw new Error("No question data received");
      }

      setImageUrl(data.question);
      setSolution(data.solution);
      setHasStarted(true);
    } catch (error) {
      console.error("Error fetching question:", error);
      setTimeout(fetchQuestion, 2000);
    }
  };

  // Countdown timer logic
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (!mainGamePaused) {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 0) {
            handleTimeUp();
            return 0;
          }
          return prevSeconds - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [lives, mainGamePaused]);

  // Handle time running out
  const handleTimeUp = () => {
    const newLives = [...lives];
    let lifeLost = false;

    // Deduct a life if available
    for (let i = newLives.length - 1; i >= 0; i--) {
      if (newLives[i] === 1) {
        if (isSoundOn && wrongSoundRef.current) {
          const audioClone = new Audio(wrongAnswer);
          audioClone
            .play()
            .catch((err) => console.log("Audio play error:", err));
        }
        newLives[i] = 0;
        lifeLost = true;
        break;
      }
    }

    setLives(newLives);

    if (newLives.every((life) => life === 0)) {
      if (isSoundOn && gameOverSoundRef.current) {
        const audioClone = new Audio(gameOver);
        audioClone
          .play()
          .catch((err) => console.log("Game over sound error:", err));
      }
      setTimeout(() => {
        alert("Game Over!");
        resetGame();
      }, 500);
    } else if (lifeLost) {
      // Only reset timer if a life was actually lost
      setSeconds(initialSettings.timer); // Reset to initial time for next attempt
    }
  };

  // Pulse effect for score display
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      if (scoreDisplayRef.current) {
        scoreDisplayRef.current.style.textShadow =
          "2px 2px 4px #FFD700, -2px 2px 4px #FFD700, 2px -2px 4px #FFD700, -2px -2px 4px #FFD700";
        setTimeout(() => {
          scoreDisplayRef.current.style.textShadow =
            "2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000";
        }, 500);
      }
    }, 1000);

    return () => clearInterval(pulseInterval);
  }, []);

  // Timer color change when below 10 seconds
  useEffect(() => {
    if (seconds <= 15) {
      timerRef.current.style.animation = "pulseGlowRed 1s ease-in-out infinite";
      timerRef.current.style.color = "#FF0000";
    } else {
      timerRef.current.style.animation = "none";
      timerRef.current.style.color = "#FFFFFF";
    }
  }, [seconds]);

  // Heart pulse effect
  useEffect(() => {
    heartsRef.current.forEach((heart, index) => {
      heart.style.animation = `pulseGlowRed 2s ease-in-out ${
        index * 0.2
      }s infinite`;
    });
  }, []);

  // Handle number button click
  const handleNumberClick = (number) => {
    const button = document.querySelector(
      `.number-button-gplay:nth-child(${number + 1})`
    );
    button.style.transform = "scale(0.9)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 100);

    checkAnswer(number);
    createParticles(button.getBoundingClientRect(), "#FFD700");
  };

  // Check if the answer is correct
  const checkAnswer = (answer) => {
    if (answer === solution) {
      if (isSoundOn && correctSoundRef.current) {
        const audioClone = new Audio(correctAnswer);
        audioClone.play().catch((err) => console.log("Audio play error:", err));
      }

      setScore((prevScore) => prevScore + 10);
      setSeconds(initialSettings.timer);
      setIsImageLoaded(false);
      fetchQuestion();
    } else {
      if (isSoundOn && wrongSoundRef.current) {
        const audioClone = new Audio(wrongAnswer);
        audioClone.play().catch((err) => console.log("Audio play error:", err));
      }

      const newLives = [...lives];
      for (let i = newLives.length - 1; i >= 0; i--) {
        if (newLives[i] === 1) {
          newLives[i] = 0;
          break;
        }
      }
      setLives(newLives);

      if (newLives.every((life) => life === 0)) {
        if (isSoundOn && gameOverSoundRef.current) {
          handleGameOver();
          const audioClone = new Audio(gameOver);
          audioClone
            .play()
            .catch((err) => console.log("Game over sound error:", err));
        }
      }
    }
  };

  // Reset the game
  const resetGame = () => {
    if (isSoundOn && clickSoundRef.current) {
      const audioClone = new Audio(buttonClick);
      audioClone
        .play()
        .catch((err) => console.log("Game over sound error:", err));
    }

    saveScoreToFirestore(score); // Save the score before navigating
    navigate("/gamemenu");
  };

  // Toggle sound
  const toggleSound = () => {
    setIsSoundOn((prev) => !prev);
    console.log("Sound toggled");
  };

  // Create particles animation
  const createParticles = (rect, color) => {
    const particleCount = 15;
    const container = document.querySelector(".game-container-gplay");

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.style.position = "absolute";
      particle.style.width = "8px";
      particle.style.height = "8px";
      particle.style.borderRadius = "50%";
      particle.style.backgroundColor = color;
      particle.style.left = `${rect.left + rect.width / 2}px`;
      particle.style.top = `${rect.top + rect.height / 2}px`;
      particle.style.pointerEvents = "none";
      particle.style.zIndex = "1000";

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

  // Create a ref for the audio
  const clickSoundRef = useRef(null);
  const linkSoundRef = useRef(null);
  const hoverSoundRef = useRef(null);
  const hoverSound2Ref = useRef(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);
  const victorySoundRef = useRef(null);
  const loseSoundRef = useRef(null);

  // Initialize audio when component mounts
  React.useEffect(() => {
    clickSoundRef.current = new Audio(buttonClick);
    linkSoundRef.current = new Audio(linkClick);
    hoverSoundRef.current = new Audio(hoverSound);
    hoverSound2Ref.current = new Audio(hoverSound2);
    correctSoundRef.current = new Audio(correctAnswer);
    wrongSoundRef.current = new Audio(wrongAnswer);
    gameOverSoundRef.current = new Audio(gameOver);
    victorySoundRef.current = new Audio(victorySound);
    loseSoundRef.current = new Audio(loseSound);

    // Preload sounds
    [
      clickSoundRef,
      linkSoundRef,
      hoverSoundRef,
      hoverSound2Ref,
      correctSoundRef,
      wrongSoundRef,
      gameOverSoundRef,
      victorySoundRef,
      loseSoundRef,
    ].forEach((ref) => {
      ref.current.volume = 0.7; // Set comfortable volume level
      ref.current.load();
    });

    return () => {
      // Clean up audio elements
      [
        clickSoundRef,
        linkSoundRef,
        hoverSoundRef,
        hoverSound2Ref,
        correctSoundRef,
        wrongSoundRef,
        gameOverSoundRef,
        victorySoundRef,
        loseSoundRef,
      ].forEach((ref) => {
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
      audioClone
        .play()
        .then(() => {
          // Clean up after playback completes
          setTimeout(() => {
            audioClone.remove();
          }, 1000);
        })
        .catch((err) => {
          console.log("Audio playback error:", err);
          audioClone.remove();
        });
    }
  };

  const handleClick = (e) => {
    if (clickSoundRef.current) {
      // Clone the audio element to allow multiple rapid plays
      const audioClone = new Audio(buttonClick);
      audioClone
        .play()
        .then(() => {
          // Clean up after playback completes
          setTimeout(() => {
            audioClone.remove();
          }, 1000);
        })
        .catch((err) => {
          console.log("Audio playback error:", err);
          audioClone.remove();
        });
    }
  };

  const handleHover = (e) => {
    if (hoverSoundRef.current) {
      // Clone the audio element to allow multiple rapid plays
      const audioClone = new Audio(hoverSound);
      audioClone
        .play()
        .then(() => {
          // Clean up after playback completes
          setTimeout(() => {
            audioClone.remove();
          }, 1000);
        })
        .catch((err) => {
          console.log("Audio playback error:", err);
          audioClone.remove();
        });
    }
  };

  const handleVictory = (e) => {
    if (victorySoundRef.current) {
      // Clone the audio element to allow multiple rapid plays
      const audioClone = new Audio(victorySound);
      audioClone
        .play()
        .then(() => {
          // Clean up after playback completes
          setTimeout(() => {
            audioClone.remove();
          }, 1000);
        })
        .catch((err) => {
          console.log("Audio playback error:", err);
          audioClone.remove();
        });
    }
  };



  const handleHover2 = (e) => {
    if (hoverSound2Ref.current) {
      // Clone the audio element to allow multiple rapid plays
      const audioClone = new Audio(hoverSound2);
      audioClone
        .play()
        .then(() => {
          // Clean up after playback completes
          setTimeout(() => {
            audioClone.remove();
          }, 1000);
        })
        .catch((err) => {
          console.log("Audio playback error:", err);
          audioClone.remove();
        });
    }
  };

  const handleGameOver = () => {
    if (isSoundOn && gameOverSoundRef.current) {
      const audioClone = new Audio(gameOver);
      audioClone
        .play()
        .catch((err) => console.log("Game over sound error:", err));
    }

    if (!usedSecondChance) {
      setShowSecondChanceModal(true);
      setMainGamePaused(true);
    } else {
      setTimeout(() => {
        endGame();
      }, 500);
    }
  };

  const endGame = () => {
    saveScoreToFirestore(score);
    navigate("/gamemenu");
  };

  const startTriviaChallenge = async () => {
    setShowSecondChanceModal(false);
    setInTriviaChallenge(true);
    setMainGamePaused(true);
    setCorrectTriviaAnswers(0);
    setCurrentTriviaIndex(0);
    setTriviaTimer(15);

    try {
      const response = await fetch("https://opentdb.com/api.php?amount=10");
      const data = await response.json();
      setTriviaQuestions(data.results);
    } catch (error) {
      console.error("Error fetching trivia questions:", error);
      // Fallback to end game if trivia fails
      endGame();
    }
  };

  // Trivia timer effect
  useEffect(() => {
    if (inTriviaChallenge && triviaQuestions.length > 0) {
      // Shuffle answers when we get a new question
      const currentQuestion = triviaQuestions[currentTriviaIndex];
      const shuffled = shuffleAnswers(
        currentQuestion.incorrect_answers,
        currentQuestion.correct_answer
      );
      setCurrentShuffledAnswers(shuffled);
      
      console.log(`[DEBUG] Correct answer for question ${currentTriviaIndex + 1}:`, 
        currentQuestion.correct_answer);
  
      // Reset timer for new question
      setTriviaTimer(15);
    }
  }, [currentTriviaIndex, inTriviaChallenge, triviaQuestions]);



  const handleTriviaAnswer = (answer) => {
    const currentQuestion = triviaQuestions[currentTriviaIndex];
    const isCorrect = answer === currentQuestion.correct_answer;

    if (isCorrect) {
      setCorrectTriviaAnswers((prev) => prev + 1);
      if (isSoundOn && correctSoundRef.current) {
        const audioClone = new Audio(correctAnswer);
        audioClone.play().catch((err) => console.log("Audio play error:", err));
      }
    } else {
      if (isSoundOn && wrongSoundRef.current) {
        const audioClone = new Audio(wrongAnswer);
        audioClone.play().catch((err) => console.log("Audio play error:", err));
      }
    }

    moveToNextTriviaQuestion();
  };

  const handleTriviaTimeout = () => {
    if (isSoundOn && wrongSoundRef.current) {
      const audioClone = new Audio(wrongAnswer);
      audioClone.play().catch((err) => console.log("Audio play error:", err));
    }
    moveToNextTriviaQuestion();
  };

  const moveToNextTriviaQuestion = () => {
    if (currentTriviaIndex < triviaQuestions.length - 1) {
      setCurrentTriviaIndex((prev) => prev + 1);
      setTriviaTimer(15);
    } else {
      finishTriviaChallenge();
    }
  };

  const finishTriviaChallenge = () => {
    setInTriviaChallenge(false);
    setMainGamePaused(false);
    setUsedSecondChance(true);

     // Play appropriate sound
  if (correctTriviaAnswers >= 7) {
    if (isSoundOn && victorySoundRef.current) {
      const audioClone = new Audio(victorySound);
      audioClone.play().catch(err => console.log("Victory sound error:", err));
      
    }
  } else {
    if (isSoundOn && loseSoundRef.current) {
      const audioClone = new Audio(loseSound);
      audioClone.play().catch(err => console.log("Game over sound error:", err));
    }
  }


    // Show results modal
    setShowTriviaResults(true);
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
            {loading ? (
              <div className="loading-indicator-gplay">Loading...</div>
            ) : (
              <div className="user-name-gplay">{playerName.toUpperCase()}</div>
            )}
          </div>
          <div className="mode-display-gplay">Mode: {mode}</div>
          <div className="life-bar-gplay">
            {lives.map((life, index) => (
              <div
                key={index}
                className="heart-gplay"
                ref={(el) => (heartsRef.current[index] = el)}
              >
                {life === 1 ? "❤️" : "🖤"}
              </div>
            ))}
          </div>
        </div>
        <button
          onMouseEnter={handleHover}
          className="quit-button-gplay"
          onClick={() => {
            resetGame();
            handleClick();
          }}
        >
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
                  console.log("Image loaded successfully:", imageUrl);
                  setIsImageLoaded(true);
                }}
                onError={(e) => {
                  console.error("Failed to load image", imageUrl, e);
                  setIsImageLoaded(false);
                  fetchQuestion();
                }}
                style={{
                  width: "100%",
                  height: "auto",
                  display: isImageLoaded ? "block" : "none",
                }}
              />
            ) : (
              <div className="loading-placeholder">Loading puzzle...</div>
            )}
          </div>
        </div>

        <div className="timer-gplay" ref={timerRef}>
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:
          {String(seconds % 60).padStart(2, "0")}
        </div>

        <div className="number-buttons-gplay">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              onMouseEnter={handleHover2}
              className="number-button-gplay"
              onClick={() => handleNumberClick(index)}
            >
              {index}
            </div>
          ))}
        </div>

        <div className="score-display-gplay" ref={scoreDisplayRef}>
          score : {String(score).padStart(3, "0")}
        </div>
      </div>

      

      {/* Second Chance Modal */}
      {showSecondChanceModal && (
        <div className="modal-overlay">
          <div className="second-chance-modal">
            <h2>GAME OVER!</h2>
            <p>Do you want a second chance?</p>
            <p>Answer 7/10 trivia questions correctly to continue!</p>
            <div className="modal-buttons">
              <button
                onClick={() => startTriviaChallenge()}
                onMouseEnter={handleHover}
              >
                YES
              </button>
              <button
                onClick={() => {
                  setShowSecondChanceModal(false);
                  endGame();
                }}
                onMouseEnter={handleHover}
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trivia Challenge UI */}
      {inTriviaChallenge && triviaQuestions.length > 0 && currentShuffledAnswers.length > 0 && (
  <div className="trivia-overlay">
    <div className="trivia-challenge">
      <h2>TRIVIA CHALLENGE</h2>
      <div className="trivia-progress">
        Question {currentTriviaIndex + 1} of {triviaQuestions.length}
      </div>
      <div className="trivia-timer">
        Time: {triviaTimer}s
      </div>
      <div className="trivia-question">
        <h3>{decodeHtml(triviaQuestions[currentTriviaIndex].question)}</h3>
        <div className="trivia-answers">
          {currentShuffledAnswers.map((answer, idx) => (
            <button
              key={idx}
              onClick={() => handleTriviaAnswer(answer)}
              onMouseEnter={handleHover2}
            >
              {decodeHtml(answer)}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
)}

{showTriviaResults && (
  <div className="modal-overlay">
    <div className="second-chance-modal">
      <h2>TRIVIA RESULTS</h2>
      <p>You answered {correctTriviaAnswers} out of 10 correctly</p>
      
      {correctTriviaAnswers >= 7 ? (
        <>
          <p>Congratulations! You earned another chance!</p>
          {isSoundOn && <audio src={victorySound} autoPlay />}
          <button 
            onClick={() => {
              handleClick();
              setShowTriviaResults(false);
              // Refill lives
              const newLives = getInitialSettings().lives;
              setLives(newLives);
              setSeconds(getInitialSettings().timer);
            }}
            onMouseEnter={handleHover}
          >
            CONTINUE GAME
          </button>
        </>
      ) : (
        <>
          <p>Sorry, you didn't get enough correct answers.</p>
          {isSoundOn && <audio src={loseSound} autoPlay />}
          <button 
            onClick={() => {
              handleClick();
              setShowTriviaResults(false);
              endGame();
            }}
            onMouseEnter={handleHover}
          >
            RETURN TO MENU
          </button>
        </>
      )}
    </div>
  </div>
)}
    </div>
  );
};
// Helper function to decode HTML entities
function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
export default GameplayPage;
