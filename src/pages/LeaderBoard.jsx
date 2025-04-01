import React, { useState, useEffect, useRef } from "react";
import "../css/LeaderBoard.css";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import {
  where,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Audio imports
import buttonClick from '../assets/audio/button_click.mp3';
import linkClick from '../assets/audio/link_click.mp3';
import hoverSound from '../assets/audio/button_hover.mp3';
import hoverSound2 from '../assets/audio/hover_sound-2.mp3';
import scrollClick from '../assets/audio/scroll.mp3'

const LeaderBoard = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("NORMAL");
  const [loading, setLoading] = useState(true);
  const [playerName, setPlayerName] = useState("PLAYER");
  const [scores, setScores] = useState([]);
  const [loadingScores, setLoadingScores] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const entriesContainerRef = useRef(null);

  // Create refs for audio
  const clickSoundRef = useRef(null);
  const linkSoundRef = useRef(null);
  const hoverSoundRef = useRef(null);
  const hoverSound2Ref = useRef(null);
  const scrollSoundRef = useRef(null);

  // Initialize audio when component mounts
  useEffect(() => {
    clickSoundRef.current = new Audio(buttonClick);
    linkSoundRef.current = new Audio(linkClick);
    hoverSoundRef.current = new Audio(hoverSound);
    hoverSound2Ref.current = new Audio(hoverSound2);
    scrollSoundRef.current = new Audio(scrollClick);

    // Preload sounds
    [clickSoundRef, linkSoundRef, hoverSoundRef, hoverSound2Ref, scrollSoundRef].forEach(ref => {
      ref.current.volume = 0.7;
      ref.current.load();
    });

    return () => {
      // Clean up audio elements
      [clickSoundRef, linkSoundRef, hoverSoundRef, hoverSound2Ref, scrollSoundRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current = null;
        }
      });
    };
  }, []);

  // Handle back button click
  const handleBackClick = () => {
    playClickSound();
    navigate("/gamemenu");
  };

  // Handle difficulty change
  const handleDifficultyChange = (e) => {
    playClickSound();
    setDifficulty(e.target.value);
  };

  // Audio handlers
  const playClickSound = () => {
    if (clickSoundRef.current) {
      const audioClone = new Audio(buttonClick);
      audioClone.play().catch(err => console.log("Audio error:", err));
    }
  };

  const playLinkSound = () => {
    if (linkSoundRef.current) {
      const audioClone = new Audio(linkClick);
      audioClone.play().catch(err => console.log("Audio error:", err));
    }
  };

  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      const audioClone = new Audio(hoverSound);
      audioClone.play().catch(err => console.log("Audio error:", err));
    }
  };

  const playHover2Sound = () => {
    if (hoverSound2Ref.current) {
      const audioClone = new Audio(hoverSound2);
      audioClone.play().catch(err => console.log("Audio error:", err));
    }
  };

  const playScrollSound = () => {
    if (scrollSoundRef.current) {
      const audioClone = new Audio(scrollClick);
      audioClone.play().catch(err => console.log("Audio error:", err));
    }
  };

  // Check scroll position and show/hide scroll buttons
  const checkScrollPosition = () => {
    if (entriesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = entriesContainerRef.current;
      setShowScrollUp(scrollTop > 0);
      setShowScrollDown(scrollTop < scrollHeight - clientHeight);
    }
  };

  // Scroll handler
  const handleScroll = (direction) => {
    if (entriesContainerRef.current) {
      const scrollAmount = 60; // Adjust scroll distance
      if (direction === 'up') {
        entriesContainerRef.current.scrollTop -= scrollAmount;
      } else {
        entriesContainerRef.current.scrollTop += scrollAmount;
      }
      setTimeout(checkScrollPosition, 100);
    }
  };

  // Fetch scores from Firestore
  useEffect(() => {
    setLoadingScores(true);

    const scoresRef = collection(db, `leaderboard_${difficulty.toLowerCase()}`);
    const q = query(scoresRef, orderBy("score", "desc"), limit(10));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const leaderboardData = [];
        querySnapshot.forEach((doc) => {
          leaderboardData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setScores(leaderboardData);
        setLoadingScores(false);
        
        // Check if we need scroll buttons after data loads
        setTimeout(() => {
          if (entriesContainerRef.current) {
            const { scrollHeight, clientHeight } = entriesContainerRef.current;
            const needsScroll = scrollHeight > clientHeight;
            setShowScrollDown(needsScroll && leaderboardData.length > 6);
          }
        }, 0);
      },
      (error) => {
        console.error("Error loading leaderboard:", error);
        setError("Failed to load leaderboard");
        setLoadingScores(false);
      }
    );

    return () => unsubscribe();
  }, [difficulty]);

  // Set up scroll event listener
  useEffect(() => {
    const container = entriesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);

  // Fetch player data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);

        if (user) {
          const q = query(
            collection(db, "players_data"),
            where("uid", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const playerData = querySnapshot.docs[0].data();
            setPlayerName(
              playerData.name || user.email?.split("@")[0] || "PLAYER"
            );
          } else {
            setPlayerName(user.email?.split("@")[0] || "PLAYER");
          }
        } else {
          setPlayerName("PLAYER");
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
        setError("Failed to load profile. Please refresh.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="game-container-ldrb">
      <div className="background-overlay-ldrb"></div>
      <div className="fire-effect-ldrb"></div>

      <div className="header-ldrb">
        <div className="user-profile-ldrb">
          <div 
            onMouseEnter={playHoverSound}
            className="user-icon-ldrb"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
            <div className="user-tooltip-ldrb">
              <h3>{loading ? "Loading..." : playerName}</h3>
              <p>Rank: 1</p>
              <p>Level: 5</p>
              <p>Total Score: 000</p>
              <p>Games Played: 10</p>
            </div>
          </div>
          <div className="user-name-ldrb">
            {loading ? (
              <span className="loading-pulse-ldrb">...</span>
            ) : (
              playerName.toUpperCase()
            )}
          </div>
        </div>
        <button 
          onMouseEnter={playHoverSound}
          className="back-button-ldrb" 
          onClick={handleBackClick}
        >
          BACK
        </button>
      </div>

      <div className="leaderboard-container-ldrb">
        <div className="difficulty-selector-ldrb">
          <select
            value={difficulty}
            onMouseEnter={playHoverSound}
            onChange={handleDifficultyChange}
            className="difficulty-dropdown-ldrb"
          >
            <option value="EASY">EASY</option>
            <option value="NORMAL">NORMAL</option>
            <option value="HARD">HARD</option>
          </select>
        </div>
        
        <div className="entry-background-ldrb"></div>
        <div className="leaderboard-title-ldrb">LEADERBOARD</div>

        {showScrollUp && (
          <button 
            className="scroll-button scroll-up"
            onClick={() => { handleScroll('up'); playScrollSound(); }}
            onMouseEnter={playHoverSound}
          >
            ↑
          </button>
        )}

        <div 
          className="leaderboard-entries-ldrb"
          ref={entriesContainerRef}
          style={{
            maxHeight: '360px', // Shows exactly 6 entries (60px each)
            overflowY: 'auto',
          }}
        >
          {loadingScores ? (
            <div className="loading-indicator-ldrb">
              <div className="spinner-ldrb"></div>
              Loading leaderboard...
            </div>
          ) : error ? (
            <div className="error-message-ldrb">
              ⚠️ {error}
              <button onClick={() => setError(null)}>Retry</button>
            </div>
          ) : scores.length > 0 ? (
            scores.map((entry, index) => (
              <div
                onMouseEnter={playHover2Sound}
                key={entry.id}
                className={`leaderboard-entry-ldrb ${index % 2 ? "even" : "odd"}`}
              >
                <div className="rank-ldrb">#{index + 1}</div>
                <div className="name-ldrb">{entry.name || "Anonymous"}</div>
                <div className="score-ldrb">{entry.score.toLocaleString()}</div>
              </div>
            ))
          ) : (
            <div className="no-scores-ldrb">
              🏆 No scores yet! Be the first to play!
            </div>
          )}
        </div>

        {showScrollDown && (
          <button 
            className="scroll-button scroll-down"
            onClick={() => { handleScroll('down'); playScrollSound(); }}
            onMouseEnter={playHoverSound}
          >
            ↓
          </button>
        )}
      </div>
    </div>
  );
};

export default LeaderBoard;