import characters from './assets/Characters.js';

const flashingAnimation = {
  duration: 40,
  isCurrentlyVisible: true,
  curPosition: 0,
};

const colors = {
  actionMessage: '#FFFFFF',
  secondaryActionMessage: '#e1e1e1  ',
  readyOrNot: '#545454'
};

const drawItems = (items, ctx, board) => {
  ctx.clearRect(0, 0, board.width, board.height);

  for (const item of items) {
    if (item.isFlashing) continue;

    switch (item.type) {
    case 'dot':
      ctx.fillStyle = '#ffffff';
      break;
    case 'fruit':
      ctx.fillStyle = '#ff0000';
      break;
    }

    ctx.beginPath();
    ctx.arc(item.position.x, item.position.y, item.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
};

const drawFlashingItems = (items, ctx, board, forceDraw=false) => {
  flashingAnimation.curPosition++;

  if (flashingAnimation.duration <= flashingAnimation.curPosition || forceDraw) {
    ctx.clearRect(0, 0, board.width, board.height);

    const flashingItems = items.filter((item) => item.isFlashing);
  
    if (flashingAnimation.isCurrentlyVisible || forceDraw) {
      for (const item of flashingItems) {
        switch (item.type) {
        case 'powerpill':
          ctx.fillStyle = '#ffffff';
          break;
        }
    
        ctx.beginPath();
        ctx.arc(item.position.x, item.position.y, item.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    }

    if (!forceDraw) {
      flashingAnimation.curPosition = 0;
      flashingAnimation.isCurrentlyVisible = !flashingAnimation.isCurrentlyVisible;
    }
  }
};

const drawPlayers = (players, ctx, board) => {
  ctx.clearRect(0, 0, board.width, board.height);

  for (const player of players) {
    if (!player.position) continue;

    if (player.inRecovery) {
      drawRecoveringGhost(player, ctx);
      continue;
    }
    if (player.isScared) {
      drawScaredGhost(player, ctx);
      continue;
    }

    ctx.fillStyle = player.color;
    ctx.fillRect(player.position.x - (player.width / 2), player.position.y - (player.height / 2), player.width, player.height);
  }
};

const drawScaredGhost = (ghost, ctx) => {
  ctx.fillStyle = '#0000FF';
  ctx.fillRect(ghost.position.x - (ghost.width / 2), ghost.position.y - (ghost.height / 2), ghost.width, ghost.height);
};

const drawRecoveringGhost = (ghost, ctx) => {
  ctx.fillStyle = '#c9c9c9';
  ctx.fillRect(ghost.position.x - (ghost.width / 2), ghost.position.y - (ghost.height / 2), ghost.width, ghost.height);
};

const drawTextElements = (elements, ctx, board) => {
  ctx.clearRect(0, 0, board.width, board.height);

  for (const text of elements) {
    ctx.fillStyle = text.color;
    ctx.font = `${text.size} 'Press Start 2P'`;
    ctx.textAlign = 'center';
    ctx.fillText(text.value, text.position.x, text.position.y + 20);
  }
};

const drawCharacters = ({
  ctx,
  board,
  players,
  highlightedPlayerKey,
  showScores,
  titleText='Select your character',
  actionMessage,
  secondaryActionMessage,
  showReadyOrNot
}) => {
  ctx.clearRect(0, 0, board.width, board.height);
  const size = 100;

  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.font = "40px 'Press Start 2P'";
  ctx.fillText(titleText, board.width / 2, 400);

  if (actionMessage) {
    ctx.font = "14px 'Press Start 2P'";
    ctx.fillStyle = colors.actionMessage;
    ctx.fillText(actionMessage, board.width / 2, 800);
  }

  if (secondaryActionMessage) {
    ctx.font = "8px 'Press Start 2P'";
    ctx.fillStyle = colors.secondaryActionMessage;
    ctx.fillText(secondaryActionMessage, board.width / 2, 820);
  }


  for (const character of characters) {
    const player = players.find(({ key }) => key === character.key);

    if ((!player || player.isCPU) && highlightedPlayerKey !== character.key) {
      ctx.globalAlpha = 0.5;
    }
    else ctx.globalAlpha = 1;

    character.position.y = board.height / 2;
    character.size = size;

    ctx.fillStyle = character.color;
    ctx.fillRect(character.position.x - (size / 2), board.height / 2 - (size / 2), size, size);
    
    ctx.fillStyle = '#000000';
    ctx.font = "20px 'Press Start 2P'";  
    ctx.fillText(player.username ?? 'CPU', character.position.x, character.position.y + (size), size, size);
    ctx.font = "12px 'Press Start 2P'";  
    ctx.fillText(player.name, character.position.x, character.position.y + size + 30, size, size);

    if (showScores) {
      ctx.font = "10px 'Press Start 2P'";
      ctx.fillText(player.score, character.position.x, character.position.y + size + 60, size, size);
    }
    
    if (showReadyOrNot && player.isReady) {
      ctx.font = "10px 'Press Start 2P'";
      ctx.fillStyle = colors.actionMessage;
      ctx.fillText('Ready', character.position.x, character.position.y + size + 65, size, size);
    }
  }
  ctx.globalAlpha = 1;
};

const drawCharacterSelection = ({
  ctx,
  board,
  players,
  highlightedPlayerKey,
  assignedCharacter,
  isReadyToPlay
}) => {
  let actionMessage;
  let secondaryActionMessage;

  if (assignedCharacter && !isReadyToPlay) {
    actionMessage = 'Press space when ready';
    secondaryActionMessage = 'Press esc to choose a different character';
  }

  drawCharacters({
    ctx,
    board,
    players,
    highlightedPlayerKey,
    titleText: 'Select your character',
    actionMessage,
    secondaryActionMessage,
    showReadyOrNot: true
  });
};

const drawGameOverScreen = ({ ctx, board, players }) => {
  ctx.clearRect(0, 0, board.width, board.height);

  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.font = "40px 'Press Start 2P'";
  ctx.fillText('Game Over', board.width / 2, 400);

  drawCharacters({
    ctx,
    board,
    players,
    showScores: true,
    titleText: 'Game Over',
    displayReadyStatus: false,
    actionMessage: 'Press space to play again'
  });
};

export {
  drawItems,
  drawFlashingItems,
  drawPlayers,
  drawTextElements,
  drawCharacterSelection,
  drawGameOverScreen
};
