export default class Item {
  constructor({ position, points, lifespan, size, isFlashing }) {
    this.position = position;
    this.points = points;
    this.lifespan = lifespan;
    this.size = size;
    this.isFlashing = isFlashing;
  }

  // override this function for more advanced items (i.e. fruits)
  draw(ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
    ctx.fill();

    ctx.stroke();
  }
}
