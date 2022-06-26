import Ghost from './Ghost.js';

export default class Pinky extends Ghost {
  constructor() {
    super();
    this.color = '#FFC0CB';
    this.key = 'pinky';
  }

  draw(ctx) {
    if (this.isScared) {
      super.drawScared(ctx);
    }
    else {
      // TODO: change to draw Pinky
      ctx.fillStyle = this.color;
      ctx.fillRect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.width, this.height);
    }
  }
}
