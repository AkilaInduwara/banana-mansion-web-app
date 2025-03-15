import React, { useEffect } from 'react'
import '../css/start_Page.css'

const start_Page = () => {
  // Create floating particles
  useEffect(() => {
    const createParticles = () => {
      const container = document.getElementById('particles-container');
      const particleCount = window.innerWidth < 768 ? 30 : 50;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random size between 2px and 5px
        const size = Math.random() * 3 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random starting position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;

        // Random opacity
        particle.style.opacity = Math.random() * 0.7 + 0.3;

        // Animation properties
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        particle.style.animation = `floatAnimation ${duration}s ease-in-out ${delay}s infinite`;

        container.appendChild(particle);
      }
    };

    createParticles();
  }, []);

  // Position and animate the magnifying glass effect
  useEffect(() => {
    const positionMagnifyingEffect = () => {
      const bananaCharacter = document.querySelector('.banana-character');
      const magnifyingEffect = document.querySelector('.magnifying-effect');

      if (bananaCharacter && magnifyingEffect) {
        // Get banana character position
        const rect = bananaCharacter.getBoundingClientRect();

        // Position to the right side of the character (adjust as needed)
        magnifyingEffect.style.left = `${rect.left + rect.width - 80}px`;
        magnifyingEffect.style.top = `${rect.top + 80}px`;
        magnifyingEffect.style.opacity = '1';
      }
    };

    // Position magnifying glass effect after a delay to ensure character is loaded
    setTimeout(positionMagnifyingEffect, 2000);

    // Reposition magnifying effect on window resize
    window.addEventListener('resize', () => {
      setTimeout(positionMagnifyingEffect, 100);
    });

    // Periodic repositioning to ensure it stays with the character during animations
    const interval = setInterval(positionMagnifyingEffect, 1000);

    return () => {
      window.removeEventListener('resize', positionMagnifyingEffect);
      clearInterval(interval);
    };
  }, []);

  const startGame = () => {
    // Play sound effect (optional)
    const audio = new Audio();
    audio.src =
      'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsS3AAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    audio.play();

    // Game start animation
    document
      .querySelectorAll(
        '.black-card, .banana-character, .title-text, .banana-text, .mansion-text, .play-button'
      )
      .forEach((el) => {
        el.style.animation = 'none';
        el.style.transition = 'all 0.5s ease-in-out';
      });

    const titleContainer = document.querySelector('.title-container');
    titleContainer.style.transform = 'scale(0.9)';
    titleContainer.style.opacity = '0';

    // Flash effect
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = 'white';
    flash.style.opacity = '0';
    flash.style.zIndex = '999';
    flash.style.transition = 'opacity 0.3s ease-in-out';
    document.body.appendChild(flash);

    setTimeout(() => {
      flash.style.opacity = '0.8';
      setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(flash);
          alert('Starting Banana Mansion game!');

          // Reset the animations
          titleContainer.style.transform = 'scale(1)';
          titleContainer.style.opacity = '1';
        }, 300);
      }, 200);
    }, 200);
  };

  return (
    <div className="game-container">
      {/* Dark overlay for the entire background */}
      <div className="background-overlay"></div>

      {/* Fire/lava effect at the bottom */}
      <div className="fire-effect"></div>

      {/* Floating particles container */}
      <div className="particles" id="particles-container"></div>

      {/* Semi-transparent black card in the center */}
      <div className="black-card"></div>

      {/* Magnifying glass glow effect (positioned by JS) */}
      <div className="magnifying-effect"></div>

      <div className="title-container">
        {/* This div will show your banana character image */}
        <div className="banana-character"></div>

        <div className="title-text">
          <div className="banana-text">BANANA</div>
          <div className="mansion-text">MANSION</div>
        </div>

        <button className="play-button" onClick={startGame}>
          PLAY
        </button>
      </div>
    </div>
  );
};

export default start_Page
