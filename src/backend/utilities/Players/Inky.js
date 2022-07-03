import Ghost from './Ghost.js';

export default class Inky extends Ghost {
  constructor() {
    super();
    this.name = 'Inky';
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
      super.draw(ctx);
    }
  }
}
