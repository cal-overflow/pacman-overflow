const flashingAnimation = {
  duration: 40,
  isCurrentlyVisible: true,
  curPosition: 0,
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


export {
  drawItems,
  drawFlashingItems,
  drawPlayers,
  drawTextElements
};
