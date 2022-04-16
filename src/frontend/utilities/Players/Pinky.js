import Ghost from './Ghost.js';

export default class Pinky extends Ghost {
  constructor() {
    super();
    this.spawnPath = [
      { x: 448, y: 464 },
      { x: 484, y: 464 }
    ];
  }

  draw(ctx) {
    if (this.isScared) {
      super.drawScared(ctx);
    }
    else {
      // TODO: change to draw Pinky
      ctx.fillStyle = '#FFC0CB';
      ctx.fillRect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.width, this.height);
    }
  }
}
