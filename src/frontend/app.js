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
  y: 30,
  width: 10,
  height: 200,
  isHollow: true
}));
game.addWall(new Wall({
  x: 30,
  y: 30,
  width: 40,
  height: 10,
  isHollow: true
}));

// outer gameboard walls
game.addWall(new Wall({
  x: 0,
  y: 0,
  width: canvas.width,
  height: 1,
  isHollow: true
}));

game.addWall(new Wall({
  x: 0,
  y: 0,
  width: 1,
  height: canvas.height,
  isHollow: true
}));

game.addWall(new Wall({
  x: canvas.width,
  y: 0,
  width: 1,
  height: canvas.height,
  isHollow: true
}));

game.addWall(new Wall({
  x: 0,
  y: canvas.height,
  width: canvas.width,
  height: 1,
  isHollow: true
}));


game.start();

document.addEventListener('keydown', (event) => {
  if (movementKeys.includes(event.key)) {
    event.preventDefault();

    if (event.key === 'w' || event.key === 'ArrowUp') {
      player.setNextMovement({ y: -1 });
    }
    else if (event.key === 'a' || event.key === 'ArrowLeft') {
      player.setNextMovement({ x: -1 });
    }
    else if (event.key === 's' || event.key === 'ArrowDown') {
      player.setNextMovement({ y: 1 });
    }
    else if (event.key === 'd' || event.key === 'ArrowRight') {
      player.setNextMovement({ x: 1 });
    }
  }
});
