import Item from './Item.js';

export default class Fruit extends Item {
  constructor(position) {
    super({
      position,
      points: Math.round((Math.random() * 4) + 1) * 50,
      size: 16
    });
  }

  use() {
    return true;
  }

  draw(ctx) {
    // TODO: change to use random fruit image

    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
    ctx.fill();

    ctx.stroke();
  }
}
