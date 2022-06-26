
export default class Text {
  constructor({ position, value, color='#808080', size='14px', }) {
    this.position = position;
    this.value = value;
    this.color = color;
    this.size = size;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.font = `${this.size} 'Press Start 2P'`;
    ctx.textAlign = 'center';
    ctx.fillText(this.value, this.position.x, this.position.y + 20);
  }
}
