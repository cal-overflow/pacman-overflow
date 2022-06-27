import {
  drawItems,
  drawFlashingItems,
  drawPlayers,
  drawTextElements
} from './Drawer.js';

const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
const backgroundCanvas = document.getElementById('background-layer');
const itemCtx = document.getElementById('item-layer').getContext('2d');
const flashingItemCtx = document.getElementById('flashing-item-layer').getContext('2d');
const textCtx = document.getElementById('text-layer').getContext('2d');
const playerCtx = document.getElementById('player-layer').getContext('2d');
const board = {
  width: backgroundCanvas.width,
  height: backgroundCanvas.height
};
// eslint-disable-next-line no-undef
const socket = io();

let items;
let firstDraw = true;

const handleGame = (game) => {
  if (game.items) {
    items = game.items;
    drawItems(items, itemCtx, board);
  }

  drawFlashingItems(items, flashingItemCtx, board, firstDraw);
  drawPlayers(game.players, playerCtx, board);
  drawTextElements(game.textElements, textCtx, board);
  firstDraw = false;
};

// TODO: change this
socket.emit('getLobbies');
socket.emit('joinLobby', 'default');

socket.on('joinedLobby', () => {
  socket.emit('loadGame');
});

socket.on('gameLoaded', (game) => {
  handleGame(game);
  socket.emit('startGame');
});
socket.on('game', handleGame);

document.addEventListener('keydown', (event) => {
  if (movementKeys.includes(event.key)) {
    event.preventDefault();

    if (event.key === 'w' || event.key === 'ArrowUp') {
      socket.emit('movePlayer', { y: -1 });
    }
    else if (event.key === 'a' || event.key === 'ArrowLeft') {
      socket.emit('movePlayer', { x: -1 });
    }
    else if (event.key === 's' || event.key === 'ArrowDown') {
      socket.emit('movePlayer', { y: 1 });
    }
    else if (event.key === 'd' || event.key === 'ArrowRight') {
      socket.emit('movePlayer', { x: 1 });
    }
  }
});
