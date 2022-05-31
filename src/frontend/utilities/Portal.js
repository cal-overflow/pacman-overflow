import Path from './Path.js';

export default class Portal extends Path {
  constructor(start, end) {
    super(start, end);
    this.weight = 1;
  }

  travel(player) {
    if (this.isHorizontal) {
      if (player.position.x === this.start.position.x) {
        player.teleport(this.end);
      }
      else {
        player.teleport(this.start);
      }
    }
    else {
      if (player.position.y === this.start.position.y) {
        player.teleport(this.end);
      }
      else {
        player.teleport(this.start);
      }
    }
  }

  containsPosition() { return false; }
}
