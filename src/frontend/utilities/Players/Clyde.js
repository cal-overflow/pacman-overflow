import Ghost from './Ghost.js';

export default class Clyde extends Ghost {
  constructor() {
    super();
    this.key = 'clyde';
  }

  draw(ctx) {
    if (this.isScared) {
      super.drawScared(ctx);
    }
    else {
      // TODO: change to draw Clyde
      ctx.fillStyle = '#FFA500';
      ctx.fillRect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.width, this.height);
    }
  }
}
