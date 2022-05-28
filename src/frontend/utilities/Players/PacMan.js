import Intersection from '../Intersection.js';
import Player from './Player.js';

export default class PacMan extends Player {
  constructor() {
    super();
    this.isPoweredUp = false;

    this.spawnPath = [
      { x: 304, y: 560 },
      { x: 592, y: 560 },
    ];
  }

  // TODO: override draw method
  // when `isPoweredUp`, draw PacMan with teeth
  draw(ctx) {
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.width, this.height);
  }

  getTargetPosition(game) {
    if (!this.isCPU) return;
    
    if (this.isPoweredUp) {
      let closestGhost;

      for (const ghost of game.players) {
        if (ghost === this) continue;

        const ghostPath = ghost.currentPath;
        let isGhostInLair = false;

        if (ghostPath instanceof Intersection) {
          isGhostInLair = ghostPath.paths.left?.isLair || ghostPath.paths.right?.isLair || ghostPath.paths.up?.isLair || ghostPath.paths.down?.isLair;
        }
        else isGhostInLair = ghostPath.isLair;

        if (!isGhostInLair) {
          ghost.distance = Math.abs(this.position.x - ghost.position.x) + Math.abs(this.position.y - ghost.position.y);
  
          if ((!closestGhost || ghost.distance < closestGhost.distance) && !isGhostInLair) {
            closestGhost = ghost;
          }
        }
      }

      if (closestGhost)
        return closestGhost.position;
    }

    let closestItem;

    for (const item of game.items) {
      item.distance = Math.abs(this.position.x - item.position.x) + Math.abs(this.position.y - item.position.y);

      if (!closestItem || item.distance < closestItem.distance) {
        closestItem = item;
      }
    }

    return closestItem.position;
  }
}
