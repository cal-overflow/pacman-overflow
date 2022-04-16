import Ghost from './Ghost.js';

export default class Clyde extends Ghost {
  constructor() {
    super();
    this.spawnPath = [
      { x: 484, y: 464 },
      { x: 520, y: 464 }
    ];
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
