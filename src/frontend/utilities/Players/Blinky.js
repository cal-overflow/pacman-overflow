import Ghost from './Ghost.js';

export default class Blinky extends Ghost {
  constructor() {
    super();
    this.key = 'blinky';
    this.isScatterMode = false; // Blinky will chase after pacman immediately
  }

  draw(ctx) {
    if (this.isScared) {
      super.drawScared(ctx);
    }
    else {
      // TODO: change to draw Blinky
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.width, this.height);
    }
  }
}
