import Item from './Item.js';

export default class PowerPill extends Item {
  constructor(position) {
    super({
      position,
      size: 12,
      points: 0
    });
  }

  use() {
    // TODO
    // power-up Pac-Man
  }
}
