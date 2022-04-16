import Game from './utilities/Game.js';
import { PacMan, Blinky, Clyde, Inky, Pinky } from './utilities/Players/index.js';

const foregroundCanvas = document.getElementById('foreground-layer');
const playerCanvas = document.getElementById('player-layer');

const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];

const game = new Game(foregroundCanvas, playerCanvas);
const player = new PacMan();
const blinky = new Blinky();
const clyde = new Clyde();
const inky = new Inky();
const pinky = new Pinky();

await game.loadGameBoard('./assets/map.json'); // load the gameboard/map from json file

game.addPlayer(player);
game.addPlayer(blinky);
game.addPlayer(clyde);
game.addPlayer(inky);
game.addPlayer(pinky);
game.start();

// TODO: remove this
// This is temporary to show many players moving at once.
// AI logic will be implemented in player classes
setInterval(() => {
  if (Math.floor(Math.random() * 2)) {
    if (Math.floor(Math.random() * 2)) {
      blinky.setMovement({ x: Math.floor(Math.random() * 2) ? -1 : 1 });
    }
    else {
      blinky.setMovement({ y: Math.floor(Math.random() * 2) ? -1 : 1 });
    }
  }

  if (Math.floor(Math.random() * 2)) {
    if (Math.floor(Math.random() * 2)) {
      clyde.setMovement({ x: Math.floor(Math.random() * 2) ? -1 : 1 });
    }
    else {
      clyde.setMovement({ y: Math.floor(Math.random() * 2) ? -1 : 1 });
    }
  }

  if (Math.floor(Math.random() * 2)) {
    if (Math.floor(Math.random() * 2)) {
      inky.setMovement({ x: Math.floor(Math.random() * 2) ? -1 : 1 });
    }
    else {
      inky.setMovement({ y: Math.floor(Math.random() * 2) ? -1 : 1 });
    }
  }

  if (Math.floor(Math.random() * 2)) {
    if (Math.floor(Math.random() * 2)) {
      pinky.setMovement({ x: Math.floor(Math.random() * 2) ? -1 : 1 });
    }
    else {
      pinky.setMovement({ y: Math.floor(Math.random() * 2) ? -1 : 1 });
    }
  }
}, 200);

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
