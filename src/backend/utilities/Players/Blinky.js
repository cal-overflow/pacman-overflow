import Ghost from './Ghost.js';

export default class Blinky extends Ghost {
  constructor() {
    super();
    this.name = 'Blinky';
    this.key = 'blinky';
    this.color = '#FF0000';
    this.isScatterMode = false; // Blinky will chase after pacman immediately
  }

  draw(ctx) {
    if (this.inRecovery) {
      super.drawRecovering(ctx);
    }
    else if (this.isScared) {
      super.drawScared(ctx);
    }
    else {
      super.draw(ctx);
    }
  }
}
