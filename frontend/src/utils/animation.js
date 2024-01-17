import anime from 'animejs';
import {showSuccess} from './customAlerts';
import Navigate from "../Components/Router/Navigate";
import Navbar from '../Components/Navbar/Navbar';
import image1 from '../img/balloon_709355.png'
import image2 from '../img/balloon_9141296.png';
import image3 from '../img/balloons_1635039.png'

function animateBalloons() {
    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach((balloon) => {
      anime({
        targets: balloon,
        translateY: '-200vh', // Fait monter les ballons
        duration: 10100, 
        easing: 'easeOutCubic'
      });
    });
  
    setTimeout(() => {
      Navbar();
      showSuccess('Vous êtes connecté');
      Navigate('/categories');
    }, 2300);
  
  }
  
  function createBalloons() {
    const container = document.querySelector('.balloon-container');
    if (!container) {
      return;
    }
    for (let i = 0; i < 100;) {
      const balloon = document.createElement('img');
      balloon.classList.add('balloon');
  
      if (i % 3 === 0) {
        balloon.src = image1;
      } else if (i % 3 === 1) {
        balloon.src = image2;
      } else {
        balloon.src = image3;
      }
  
      // Positionnement aléatoire autour du formulaire
      const position = getRandomPosition();
      balloon.style.position = 'absolute';
      balloon.style.left = `${position.x}%`;
      balloon.style.top = `${position.y}%`;
  
      container.appendChild(balloon);
  
      i+=1;
    }
  }
  
  function getRandomPosition() {
    // Retourner des positions aléatoires
    return {
      x: Math.random() * 100,
      y: Math.random() * 100
    };
  }

  export{createBalloons, animateBalloons}