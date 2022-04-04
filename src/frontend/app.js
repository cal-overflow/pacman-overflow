import Game from './utilities/Game.js';
import Player from './utilities/Player.js';

const canvas = document.querySelector('canvas');
const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];

const game = new Game(canvas);
const player = new Player();

await game.loadGameBoard('./maps/dev.json'); // load the gameboard/map from json file

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
