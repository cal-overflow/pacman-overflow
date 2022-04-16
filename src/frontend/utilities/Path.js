export default class Path {
  constructor(start, end, isLair=false) {
    this.isSafe = true;
    this.start = start;
    this.end = end;
    this.isLair = isLair;
    this.isHorizontal = this.start.position.y === this.end.position.y;
    this.isVertical = !this.isHorizontal;

    this.start.addPath(this);
    this.end.addPath(this);
  }

  draw(ctx) {
    if (this.isHorizontal) {
      ctx.fillRect(this.start.position.x, this.start.position.y, this.end.position.x - this.start.position.x, 1);
    }
    else ctx.fillRect(this.start.position.x, this.start.position.y, 1, this.end.position.y - this.start.position.y);
  }
}
