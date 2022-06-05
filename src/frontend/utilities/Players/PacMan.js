import Intersection from '../Intersection.js';
import Portal from '../Portal.js';
import Player from './Player.js';

const CHANCE_ATTACK_LAIR_WHEN_POWERED_UP = 0.2;
const CHANCE_IGNORE_GHOST_WHEN_POWERED_UP = 0.5;

export default class PacMan extends Player {
  constructor() {
    super();
    this.isPoweredUp = false;
  }

  spawn({ paths, players, items, map }) {
    let spawnPath;

    // Assume this is initial spawn if score is 0
    if (!this.score) {
      spawnPath = map.playerSpawnPaths.pacman;
    }
    else { 
      const validPaths = paths.filter((path) => {
        if (path.isLair || path instanceof Portal) {
          return false;
        }
        const containsGhost = players.some(({ position }) => path.containsPosition(position));
        const containsPills = items.some(({ position }) => path.containsPosition(position));

        return !containsGhost && !containsPills;
      });

      const pathIndex = Math.floor(Math.random() * validPaths.length);
      spawnPath = [validPaths[pathIndex].start.position, validPaths[pathIndex].end.position];
    }

    for (const path of paths) {
      const isMatchingStart = path.start.position.x === spawnPath[0].x && path.start.position.y === spawnPath[0].y;
      const isMatchingEnd = path.end.position.x === spawnPath[1].x && path.end.position.y === spawnPath[1].y;

      if (isMatchingStart && isMatchingEnd) {
        super.spawn(path);
        return;
      }
    }
  }

  // TODO: override draw method
  // when `isPoweredUp`, draw PacMan with teeth
  draw(ctx) {
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.width, this.height);
  }

  getTargetPosition(game) {
    if (!this.isCPU) return;
    
    let closestGhost, closestItem;

    if (this.isPoweredUp) {
      for (const ghost of game.players) {
        if (ghost === this) continue;

        const ghostPath = ghost.currentPath;
        let isGhostInLair = false;

        if (ghostPath instanceof Intersection) {
          isGhostInLair = ghostPath.paths.left?.isLair || ghostPath.paths.right?.isLair || ghostPath.paths.up?.isLair || ghostPath.paths.down?.isLair;
        }
        else isGhostInLair = ghostPath.isLair;

        if (!isGhostInLair || Math.random() < CHANCE_ATTACK_LAIR_WHEN_POWERED_UP) {
          ghost.distance = Math.abs(this.position.x - ghost.position.x) + Math.abs(this.position.y - ghost.position.y);
  
          if ((!closestGhost || ghost.distance < closestGhost.distance) && !isGhostInLair) {
            closestGhost = ghost;
          }
        }
      }

      if (closestGhost && Math.random() < CHANCE_IGNORE_GHOST_WHEN_POWERED_UP)
        return closestGhost.position;
    }

    for (const item of game.items) {
      item.distance = Math.abs(this.position.x - item.position.x) + Math.abs(this.position.y - item.position.y);

      if (!closestItem || item.distance < closestItem.distance) {
        closestItem = item;
      }
    }

    return closestItem.position;
  }
}
