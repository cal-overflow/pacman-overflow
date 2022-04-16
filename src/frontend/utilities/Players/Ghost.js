import Player from './Player.js';

export default class Ghost extends Player {
  constructor() {
    super();
    this.isScared = false;
  }

  // in subclasses (Clyde, Inky, Pinky, etc.) call `super.drawScared()` whenever the `isScared` is true
  drawScared(ctx) {
    // This is to be envoked when the ghost is scared
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.width, this.height);
  }
}
