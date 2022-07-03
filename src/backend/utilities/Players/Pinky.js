import Ghost from './Ghost.js';

export default class Pinky extends Ghost {
  constructor() {
    super();
    this.name = 'Pinky';
    this.color = '#FFC0CB';
    this.key = 'pinky';
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
