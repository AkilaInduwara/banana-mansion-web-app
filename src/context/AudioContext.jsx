import React, { createContext, useEffect, useRef, useState } from "react";
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
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          zIndex: 1000,
          backgroundColor: isPlaying ? "red" : "green",
          color: "white",
          border: "none",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        {isPlaying ? "Turn Off Music" : "Turn On Music"}
      </button>
    </AudioContext.Provider>
  );
};
