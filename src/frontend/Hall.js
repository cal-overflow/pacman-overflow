import Path from './Path.js';
import Wall from './Wall.js';

const wallThickness = 8;

export default class Hall extends Path {
  constructor(options) {
    super(options);
    this.walls = [];

    if (this.horizontal) {
      this.walls.push(new Wall({
        x: this.start,
        y: this.center - 20,
        width: this.length,
        height: wallThickness
      }));

      this.walls.push(new Wall({
        x: this.start,
        y: this.center + 20 - wallThickness,
        width: this.length,
        height: wallThickness
      }));
    }
    else {
      this.walls.push(new Wall({
        x: this.center - 20,
        y: this.start,
        width: wallThickness,
        height: this.length
      }));

      this.walls.push(new Wall({
        x: this.center + 20 - wallThickness,
        y: this.start,
        width: wallThickness,
        height: this.length
      }));
    }
  }

  draw(ctx) {
    for (const wall of this.walls) {
      wall.draw(ctx);
    }

    // TODO: DELETE
    if (this.horizontal) ctx.fillRect(this.start, this.center, this.length, 1); // TODO: delete
    else ctx.fillRect(this.center, this.start, 1, this.length); // TODO: delete
  }
}
