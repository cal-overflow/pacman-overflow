import Game from './Game.js';
import Player from './Player.js';
import Hall from './Hall.js';
import Intersection from './Intersection.js';

const canvas = document.querySelector('canvas');
const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];

const game = new Game(canvas);

const paths = [];

//above
paths.push(new Hall({
  vertical: true,
  center: 250,
  start: 100,
  end: 200
}));

// below
// paths.push(new Hall({
//   vertical: true,
//   center: 250,
//   start: 280,
//   end: 350
// }));

// right
paths.push(new Hall({
  horizontal: true,
  center: 250,
  start: 280,
  end: 450
}));

// left
// paths.push(new Hall({
//   horizontal: true,
//   center: 250,
//   start: 100,
//   end: 200
// }));

game.addPath(paths[0]);
game.addPath(paths[1]);
// game.addPath(paths[2]);
// game.addPath(paths[3]);

game.addPath(new Intersection(paths));

const player = new Player();
game.addPlayer(player);

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
