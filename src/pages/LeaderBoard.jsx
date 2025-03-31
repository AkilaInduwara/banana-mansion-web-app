import React, { useState, useEffect } from "react";
import "../css/LeaderBoard.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
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

const LeaderBoard = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("NORMAL");
  const [loading, setLoading] = useState(true); // Add this
  const [playerName, setPlayerName] = useState("PLAYER");
  const [scores, setScores] = useState([]);
  const [loadingScores, setLoadingScores] = useState(true);
  const [error, setError] = useState(null);

  const handleBackClick = () => {
    navigate("/gamemenu");
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    // Here you would typically fetch leaderboard data for the selected difficulty
    // For now, we'll just update the state
  };

  // Fetch scores from Firestore
  useEffect(() => {
    setLoadingScores(true);

    // Reference to the correct leaderboard collection
    const scoresRef = collection(db, `leaderboard_${difficulty.toLowerCase()}`);

    // Create optimized query:
    // - Sorted by score (descending)
    // - Limited to top 10
    const q = query(scoresRef, orderBy("score", "desc"), limit(10));

    // Real-time listener
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
      },
      (error) => {
        console.error("Error loading leaderboard:", error);
        setError("Failed to load leaderboard");
        setLoadingScores(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [difficulty]); // Re-run when difficulty changes

  useEffect(() => {
    // Set up auth state observer
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);

        if (user) {
          // User is signed in - fetch player data
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
            console.log("No player data found - using fallback name");
            setPlayerName(user.email?.split("@")[0] || "PLAYER");
          }
        } else {
          // User is signed out
          setPlayerName("PLAYER");
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
        setError("Failed to load profile. Please refresh.");
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="game-container-ldrb">
      {/* Dark overlay for the entire background */}
      <div className="background-overlay-ldrb"></div>

      {/* Fire/lava effect at the bottom */}
      <div className="fire-effect-ldrb"></div>

      {/* Header with user profile and back button */}
      <div className="header-ldrb">
        <div className="user-profile-ldrb">
          <div className="user-icon-ldrb">
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
        <button className="back-button-ldrb" onClick={handleBackClick}>
          BACK
        </button>
      </div>

      {/* Leaderboard container */}
      <div className="leaderboard-container-ldrb">
        {/* Difficulty selector dropdown */}
        <div className="difficulty-selector-ldrb">
          <select
            value={difficulty}
            onChange={handleDifficultyChange}
            className="difficulty-dropdown-ldrb"
          >
            <option value="EASY">EASY</option>
            <option value="NORMAL">NORMAL</option>
            <option value="HARD">HARD</option>
          </select>
        </div>
        {/* Transparent black box for entries background */}
        <div className="entry-background-ldrb"></div>

        <div className="leaderboard-title-ldrb">LEADERBOARD</div>

        <div className="leaderboard-entries-ldrb">
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
                key={entry.id}
                className={`leaderboard-entry-ldrb ${
                  index % 2 ? "even" : "odd"
                }`}
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
      </div>
    </div>
  );
};
export default LeaderBoard;
