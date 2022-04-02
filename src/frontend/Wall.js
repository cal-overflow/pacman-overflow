export default class Wall {
  constructor({ x, y, width, height, isHollow=false }) {
    this.id = Math.floor(Math.random() * 100);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isHollow = isHollow;
  }

  draw(ctx) {
    const color = '#000000';

    if (this.isHollow) {
      ctx.strokeStyle = color;
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
    else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
