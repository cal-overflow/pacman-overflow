export default class Item {
  constructor({ position, points, lifespan, size, isFlashing, type='item' }) {
    this.position = position;
    this.type = type;
    this.points = points;
    this.lifespan = lifespan;
    this.size = size;
    this.isFlashing = isFlashing;
  }
}
