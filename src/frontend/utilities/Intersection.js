export default class Intersection {
  constructor(position) {
    this.position = position;
    this.paths = {};
  }

  addPath(path) {
    if (path.isHorizontal) {
      if (path.start === this) {
        this.paths.right = path;
      }
      else if (path.end === this) {
        this.paths.left = path;
      }
    }
    else  {
      if (path.start === this) {
        this.paths.down = path;
      }
      else if (path.end === this) {
        this.paths.up = path;
      }
    }
  }
  
  traverse(movement) {
    if (movement.x) {
      if (movement.x === -1) {
        return this.paths.left;
      }
      if (movement.x === 1) {
        return this.paths.right;
      }
    }
    else if (movement.y) {
      if (movement.y === -1) {
        return this.paths.up;
      }
      if (movement.y === 1) {
        return this.paths.down;
      }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 8, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
