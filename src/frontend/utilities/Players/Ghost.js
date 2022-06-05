import Player from './Player.js';
import PacMan from './PacMan.js';

const CHANCE_RUN_FROM_POWERED_PACMAN = 0.9;
const MAX_SECONDS_PER_TRAVEL_MODE = 20;
const MIN_SECONDS_PER_TRAVEL_MODE = 5;

export default class Ghost extends Player {
  constructor() {
    super();
    this.canTraverseLair = true;
    this.isScared = false;
    this.isScatterMode = true;
    this.travelModeToggleTimeoutId = undefined;
  }

  spawn({ paths, map }, ghostKey) {
    const spawnPath = map.playerSpawnPaths[ghostKey];
    
    for (const path of paths) {
      const isMatchingStart = path.start.position.x === spawnPath[0].x && path.start.position.y === spawnPath[0].y;
      const isMatchingEnd = path.end.position.x === spawnPath[1].x && path.end.position.y === spawnPath[1].y;

      if (isMatchingStart && isMatchingEnd) {
        super.spawn(path);
        return;
      }
    }
  }

  toggleTravelMode() {
    this.travelModeToggleTimeoutId = setTimeout(() => {
      this.isScatterMode = !this.isScatterMode;
      this.travelModeToggleTimeoutId = undefined;
    }, Math.round((Math.random() * (MAX_SECONDS_PER_TRAVEL_MODE - MIN_SECONDS_PER_TRAVEL_MODE + 1)) + MIN_SECONDS_PER_TRAVEL_MODE) * 1000);
  }

  // TODO: consider changing this so that the ghosts have their own "chase" behavior
  getPacManPosition(game) {
    if (this.isScared && Math.random() < CHANCE_RUN_FROM_POWERED_PACMAN) {
      const lairPaths = game.paths.filter((path) => path.isLair);
      const chosenPath = lairPaths[Math.floor(Math.random() * lairPaths.length)];
      
      return Math.random() < 0.5 ? chosenPath.start.position : chosenPath.end.position;
    }

    const pacman = game.players.find((player) => player instanceof PacMan);

    return pacman.position;
  }

  drawScared(ctx) {
    // This is to be envoked when the ghost is scared
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.width, this.height);
  }
}
