import Ghost from './Ghost.js';

export default class Clyde extends Ghost {
  constructor() {
    super();
    this.name = 'Clyde';
    this.color = '#FFA500';
    this.key = 'clyde';
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
