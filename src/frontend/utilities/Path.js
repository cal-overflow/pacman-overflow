export default class Path {
  constructor(start, end, isLair=false) {
    this.isSafe = true;
    this.start = start;
    this.end = end;
    this.isLair = isLair;
    this.isHorizontal = this.start.position.y === this.end.position.y;
    this.isVertical = !this.isHorizontal;

    // The weight of the path is its length
    const axis = this.isHorizontal ? 'x' : 'y';
    this.weight = this.end.position[axis] - this.start.position[axis] ?? 0;

    this.start.addPath(this);
    this.end.addPath(this);
  }

  containsPosition(position) {
    if (!position) return false;

    if (this.isVertical) {
      return this.start.position.x === position.x && this.start.position.y < position.y && position.y < this.end.position.y;
    }
    else {
      return this.start.position.y === position.y && this.start.position.x < position.x && position.x < this.end.position.x;
    }
  }
}
