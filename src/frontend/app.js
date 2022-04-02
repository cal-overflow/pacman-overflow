import Game from './Game.js';
import Player from './Player.js';
import Wall from './Wall.js';

const canvas = document.querySelector('canvas');
const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];

const game = new Game(canvas);
const player = new Player();
game.addPlayer(player);

// TODO: remove - these are walls for dev purposes
game.addWall(new Wall({
  x: 30,
  y: 100,
  width: 100,
  height: 6,
}));
game.addWall(new Wall({
  x: 30,
  y: 136,
  width: 100,
  height: 6,
}));

// outer gameboard wall
game.addWall(new Wall({
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
  isHollow: true
}));


game.start();

document.addEventListener('keydown', (event) => {
  if (movementKeys.includes(event.key)) {
    event.preventDefault();

    player.stop();
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
