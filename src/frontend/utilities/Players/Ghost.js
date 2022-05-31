import Player from './Player.js';
import PacMan from './PacMan.js';

const CHANCE_RUN_FROM_POWERED_PACMAN = 0.9;

export default class Ghost extends Player {
  constructor() {
    super();
    this.canTraverseLair = true;
    this.isScared = false;
  }

  // in subclasses (Clyde, Inky, Pinky, etc.) call `super.drawScared()` whenever the `isScared` is true
  drawScared(ctx) {
    // This is to be envoked when the ghost is scared
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.width, this.height);
  }


  // For now, all ghosts target position will simply be PacMan or the lair (given they are scared).
  // TODO: Change this so that each ghost has their own behavior 
  getTargetPosition(game) {
    if (!this.isCPU) return;

    if (this.isScared && Math.random() < CHANCE_RUN_FROM_POWERED_PACMAN) {
      const lairPaths = game.paths.filter((path) => path.isLair);
      const chosenPath = lairPaths[Math.floor(Math.random() * lairPaths.length)];
      
      return Math.random() < 0.5 ? chosenPath.start.position : chosenPath.end.position;
    }

    const pacman = game.players.find((player) => player instanceof PacMan);

    return pacman.position;
  }
}
