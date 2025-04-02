import React, { createContext, useEffect, useRef, useState } from "react";
import "../css/AudioContext.css"; // Import CSS for styling
import backgroundMusic from "../assets/audio/background-music-01.mp3";

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // Default to false to wait for user interaction

  useEffect(() => {
    audioRef.current = new Audio(backgroundMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5; // Adjust volume as needed

    const startAudio = () => {
      audioRef.current.play().catch((err) => console.error("Audio playback error:", err));
      setIsPlaying(true);
      document.removeEventListener("click", startAudio); // Remove listener after interaction
    };

    document.addEventListener("click", startAudio); // Wait for user interaction

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener("click", startAudio); // Cleanup listener
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => console.error("Audio playback error:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <AudioContext.Provider value={{ toggleAudio, isPlaying }}>
      {children}
      <button
  onClick={toggleAudio}
  className="sound-control-acont"
  style={{ borderColor: isPlaying ? "#ff0000" : "#00ff00" }}
>
  <div className="sound-icon-acont">
    {isPlaying ? (
      <>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
          <line x1="3" y1="3" x2="21" y2="21"></line>
        </svg>
        <span>Mute</span>
      </>
    ) : (
      <>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
        <span>Play</span>
      </>
    )}
  </div>
</button>
    </AudioContext.Provider>
  );
};
