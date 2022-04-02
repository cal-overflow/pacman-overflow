import Player from './Player.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];

const player = new Player();
player.spawn({ x: 30, y: 30 });

ctx.fillStyle = '#FFFFFF';
setInterval(() => {
  player.move();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(player.position.x, player.position.y, 20, 20);
}, 10);


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
