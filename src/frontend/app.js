/* eslint-disable no-undef */
import {
  drawItems,
  drawFlashingItems,
  drawPlayers,
  drawTextElements,
  drawCharacterSelection,
  drawGameOverScreen
} from './Drawer.js';
import Characters from './assets/Characters.js';

const isCreatingPrivateLobby = document.getElementById('private-lobby-checkbox').checked;

const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
const backgroundCanvas = document.getElementById('background-layer');
const itemCtx = document.getElementById('item-layer').getContext('2d');
const flashingItemCtx = document.getElementById('flashing-item-layer').getContext('2d');
const textCtx = document.getElementById('text-layer').getContext('2d');
const playerCtx = document.getElementById('player-layer').getContext('2d');
const menuCanvas = document.getElementById('menu-layer');
const gameBoard = document.getElementById('game-board');
const scoreboard = document.getElementById('scoreboard');
const menuCtx = menuCanvas.getContext('2d');
const board = {
  width: backgroundCanvas.width,
  height: backgroundCanvas.height
};
const socket = io();
const username = localStorage.getItem('username');
let items;
let assignedCharacter;
let gameStatus;
let copyOfPlayers = [];
const lobby = queryParams.get('lobby');
const scoreboardRowClasses = ['scoreboard-row-1', 'scoreboard-row-2', 'scoreboard-row-3', 'scoreboard-row-4', 'scoreboard-row-5'];
let isReadyToPlay = false;

const selectPlayer = ({ players }) => {
  copyOfPlayers = players;
  drawCharacterSelection({ ctx: menuCtx, board, players });
};

const handleGameUpdate = (game) => {
  if (!gameStatus && assignedCharacter) {
    menuCanvas.classList.add('invisible');
    gameBoard.classList.remove('invisible');
    scoreboard.classList.remove('invisible');
    gameStatus = 'started';
  }

  if (game.items) {
    items = game.items;
    if (assignedCharacter) drawItems(items, itemCtx, board);
  }

  if (!assignedCharacter) return;

  drawFlashingItems(items, flashingItemCtx, board);
  drawPlayers(game.players, playerCtx, board);
  drawTextElements(game.textElements, textCtx, board);

  const playersSortedByScore = game.players.sort((a, b) => a.score < b.score);

  // TODO: Only need to do this when the scores are different from before
  for (let i = 0; i < playersSortedByScore.length; i++) {
    const player = playersSortedByScore[i];
    
    const playerScoreElement = document.getElementById(`${player.key}-score`);
    playerScoreElement.innerHTML = player.score;
    playerScoreElement.classList.remove(...scoreboardRowClasses);
    playerScoreElement.classList.add(`scoreboard-row-${i + 1}`);
    
    const playerNameElement = document.getElementById(`${player.key}-name`);
    playerNameElement.innerHTML = player.username ?? player.name;
    playerNameElement.classList.remove(...scoreboardRowClasses);
    playerNameElement.classList.add(`scoreboard-row-${i + 1}`);
  }
};

socket.emit('joinLobby', { username, lobby: lobby, isCreatingPrivateLobby });

socket.on('joinedLobby', ({ lobbyName, game }) => {
  if (!lobby) {
    const urlWithQueryParams = new URL(window.location);
    urlWithQueryParams.searchParams.set('lobby', lobbyName);
    window.history.pushState('', 'New Page Title', urlWithQueryParams);
  }

  items = game.items;
  drawItems(items, itemCtx, board);
  selectPlayer(game);
});

socket.on('characterAssignment', (players) => {
  assignedCharacter = players.find((player) => player.username === username);
  let highlightedPlayerKey;
  let actionMessage;

  if (assignedCharacter) {
    isReadyToPlay = assignedCharacter.isReady;
    highlightedPlayerKey = assignedCharacter.key;
    actionMessage = 'Press space when ready';
  }

  drawCharacterSelection({ ctx: menuCtx, board, players, highlightedPlayerKey, actionMessage });
  copyOfPlayers = players;
});

socket.on('game', handleGameUpdate);
socket.on('gameEnd', (gameData) => {
  gameStatus = 'over';

  gameBoard.classList.add('invisible');
  scoreboard.classList.add('invisible');
  menuCanvas.classList.remove('invisible');
  drawGameOverScreen({ ctx: menuCtx, board, ...gameData });

  setTimeout(() => window.location.href = '../', 60000);
});

document.addEventListener('keydown', (event) => {
  if (assignedCharacter && movementKeys.includes(event.key)) {
    if (document.activeElement.id.endsWith('-input')) return;

    event.preventDefault();
    if (event.repeat) return;

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
  else if (event.key === ' ' || event.code === 'space') {
    if (!gameStatus && assignedCharacter && !isReadyToPlay) {
      socket.emit('readyToPlay');
    }
    if (gameStatus === 'over') {
      window.location.href = '/';
    }
  }
});

const getPlayerBeingHoveredOn = (event) => {
  const rect = menuCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const character = Characters.find(({ position, size, key }) => {
    if (position.x  - (size / 2) <= x && x <= position.x + (size / 2)) {
      if (position.y  - (size / 2) <= y && y <= position.y + (size / 2)) {
        const player = copyOfPlayers.find((player) => player.key === key);
        return player.isCPU;
      }
    }
  });

  return {
    key: character?.key,
    isCharacter: Boolean(character),
    position: { x, y },
  };
};

let prevHoverKey;
const mousemoveHandler = (event) => {
  if (assignedCharacter) return;

  const hoverEvent = getPlayerBeingHoveredOn(event);

  if (hoverEvent.isCharacter) {
    menuCanvas.classList.add('cursor-pointer');
  }
  else {
    menuCanvas.classList.remove('cursor-pointer');
  }

  if (prevHoverKey !== hoverEvent.key) {
    drawCharacterSelection({
      ctx: menuCtx,
      board,
      players: copyOfPlayers,
      highlightedPlayerKey: hoverEvent.key,
    });
  }
  prevHoverKey = hoverEvent.key;
};

menuCanvas.addEventListener('mousemove', mousemoveHandler);

menuCanvas.addEventListener('mousedown', (event) => {
  if (assignedCharacter) return;

  const hoverEvent = getPlayerBeingHoveredOn(event);
  if (hoverEvent.key) {
    menuCanvas.removeEventListener('mousemove', mousemoveHandler);
    
    menuCanvas.classList.remove('cursor-pointer');
    socket.emit('selectCharacter', hoverEvent.key);
  }
});


