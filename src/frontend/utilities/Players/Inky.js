import Ghost from './Ghost.js';

export default class Inky extends Ghost {
  constructor() {
    super();
    this.spawnPath = [
      { x: 412, y: 464 },
      { x: 448, y: 464 }
    ];
  }

  draw(ctx) {
    if (this.isScared) {
      super.drawScared(ctx);
    }
    else {
      // TODO: change to draw Inky
      ctx.fillStyle = '#ADD8E6';
      ctx.fillRect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.width, this.height);
    }
  }
}
