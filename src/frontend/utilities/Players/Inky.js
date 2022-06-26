import Ghost from './Ghost.js';

export default class Inky extends Ghost {
  constructor() {
    super();
    this.color = '#ADD8E6';
    this.key = 'inky';
  }

  draw(ctx) {
    if (this.inRecovery) {
      super.drawRecovering(ctx);
    }
    else if (this.isScared) {
      super.drawScared(ctx);
    }
    else {
      // TODO: change to draw Inky
      ctx.fillStyle = this.color;
      ctx.fillRect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.width, this.height);
    }
  }
}
