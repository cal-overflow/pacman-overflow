import Player from './Player.js';

export default class PacMan extends Player {
  constructor() {
    super();
    this.isPoweredUp = false;

    this.spawnPath = [
      { x: 304, y: 560 },
      { x: 592, y: 560 },
    ];
  }

  // TODO: override draw method
  // when `isPoweredUp`, draw PacMan with teeth
  draw(ctx) {
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.width, this.height);
  }
}
