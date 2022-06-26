
export default class Text {
  constructor({ position, value, color='#808080', size='22px', }) {
    this.position = position;
    this.value = value;
    this.color = color;
    this.size = size;
  }

  draw(ctx) {
    // TODO: add custom font and more stying
    ctx.fillStyle = this.color;
    ctx.font = `${this.size} bold Mono`;
    ctx.fillText(this.value, this.position.x - 16, this.position.y + 20);
  }
}
