import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/StartPage.css';

const StartPage = () => {
  const navigate = useNavigate();

  // Create floating particles
  useEffect(() => {
    const createParticles = () => {
      const container = document.getElementById('particles-container-start');
      const particleCount = window.innerWidth < 768 ? 50 : 100;
    
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle-start');
        
        // Randomly assign particle type
        const types = ['ember', 'dust', 'smoke'];
        const type = types[Math.floor(Math.random() * types.length)];
        particle.classList.add(type);
    
        const size = Math.random() * (type === 'smoke' ? 15 : 5) + (type === 'ember' ? 2 : 1);
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
    
        const posX = Math.random() * 100;
        const posY = type === 'smoke' ? Math.random() * 30 + 70 : Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
    
        particle.style.opacity = Math.random() * 0.7 + 0.1;
    
        const duration = Math.random() * (type === 'smoke' ? 30 : 20) + 10;
        const delay = Math.random() * 5;
        const animation = type === 'smoke' ? `smokeRise ${duration}s ease-out ${delay}s infinite` : `floatAnimation ${duration}s ease-in-out ${delay}s infinite`;
    
        particle.style.animation = animation;
        particle.style.filter = `blur(${type === 'smoke' ? Math.random() * 2 + 1 : 0.5}px)`;
    
        container.appendChild(particle);
      }
    };

    createParticles();
  }, []);

  // Position and animate the magnifying glass effect
  useEffect(() => {
    const positionMagnifyingEffect = () => {
      const bananaCharacter = document.querySelector('.banana-character-start');
      const magnifyingEffect = document.querySelector('.magnifying-effect-start');

      if (bananaCharacter && magnifyingEffect) {
        const rect = bananaCharacter.getBoundingClientRect();
        magnifyingEffect.style.left = `${rect.left + rect.width - 80}px`;
        magnifyingEffect.style.top = `${rect.top + 80}px`;
        magnifyingEffect.style.opacity = '1';
      }
    };

    setTimeout(positionMagnifyingEffect, 2000);

    window.addEventListener('resize', () => {
      setTimeout(positionMagnifyingEffect, 100);
    });

    const interval = setInterval(positionMagnifyingEffect, 1000);

    return () => {
      window.removeEventListener('resize', positionMagnifyingEffect);
      clearInterval(interval);
    };
  }, []);

  const startGame = () => {
    const audio = new Audio();
    audio.src = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbns0MjAyMzUzM...'; // Make sure audio source is correct
    audio.play();

    document.querySelectorAll('.black-card-start, .banana-character-start, .title-text-start, .banana-text-start, .mansion-text-start, .play-button-start')
      .forEach((el) => {
        el.style.animation = 'none';
        el.style.transition = 'all 0.5s ease-in-out';
      });

    const titleContainer = document.querySelector('.title-container-start');
    titleContainer.style.transform = 'scale(0.9)';
    titleContainer.style.opacity = '0';

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
          titleContainer.style.transform = 'scale(1)';
          titleContainer.style.opacity = '1';
        }, 300);
      }, 200);
    }, 200);
  };

  // Timer to navigate to the /login page after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); // Redirect after 4 seconds
    }, 7500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="game-container-start">
      <div className="background-overlay-start"></div>
      <div className="fire-effect-start"></div>
      <div className="smoke-effect-start"></div>
      <div className="particles-start" id="particles-container-start"></div>
      <div className="black-card-start"></div>
      <div className="magnifying-effect-start"></div>

      <div className="title-container-start">
        <div className="banana-character-start"></div>

        <div className="title-text-start">
          <div className="banana-text-start">BANANA</div>
          <div className="mansion-text-start">MANSION</div>
        </div>

        {/* <button className="play-button-start" onClick={startGame}>
          PLAY
        </button> */}
      </div>
    </div>
  );
};

export default StartPage;