export default class Wall {
  constructor({ x, y, width, height }) {
    this.id = Math.floor(Math.random() * 100);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
  }
}
