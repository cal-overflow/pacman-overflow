import Game from './utilities/Game.js';
import { PacMan, Blinky, Clyde, Inky, Pinky } from './utilities/Players/index.js';

const foregroundCanvas = document.getElementById('foreground-layer');
const animationCanvas = document.getElementById('animation-layer');
const textCanvas = document.getElementById('text-layer');
const playerCanvas = document.getElementById('player-layer');

const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];

const res = await fetch('./assets/map.json');
const map = await res.json();
const game = new Game({ foregroundCanvas, animationCanvas, textCanvas, playerCanvas, map });

const player = new PacMan();
player.isCPU = false; // TODO: Change where this happens
const blinky = new Blinky();
const clyde = new Clyde();
const inky = new Inky();
const pinky = new Pinky();

game.addPlayer(player);
game.addPlayer(blinky);
game.addPlayer(clyde);
game.addPlayer(inky);
game.addPlayer(pinky);
game.start();

document.addEventListener('keydown', (event) => {
  if (movementKeys.includes(event.key)) {
    event.preventDefault();

    if (event.key === 'w' || event.key === 'ArrowUp') {
      player.setMovement({ y: -1 });
    }
    else if (event.key === 'a' || event.key === 'ArrowLeft') {
      player.setMovement({ x: -1 });
    }
    else if (event.key === 's' || event.key === 'ArrowDown') {
      player.setMovement({ y: 1 });
    }
    else if (event.key === 'd' || event.key === 'ArrowRight') {
      player.setMovement({ x: 1 });
    }
  }
});
