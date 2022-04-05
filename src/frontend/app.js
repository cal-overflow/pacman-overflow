import Game from './utilities/Game.js';
import Player from './utilities/Player.js';

const foregroundCanvas = document.getElementById('foreground-layer');
const playerCanvas = document.getElementById('player-layer');

const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];

const game = new Game(foregroundCanvas, playerCanvas);
const player = new Player();

await game.loadGameBoard('./assets/map.json'); // load the gameboard/map from json file

game.addPlayer(player);
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
