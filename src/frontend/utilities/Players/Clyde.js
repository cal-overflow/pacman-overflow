import Ghost from './Ghost.js';

export default class Clyde extends Ghost {
  constructor() {
    super();
  }

  spawn(game) {
    super.spawn(game, 'clyde');
  }

  getTargetPosition(game) {
    if (!this.isCPU) return;

    if (this.isScatterMode) {
      return; // TODO: return an intersection in the corner that this ghost likes going to
    }

    return super.getPacManPosition(game);
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
