import Item from './Item.js';

export default class Dot extends Item {
  constructor(position) {
    super({
      position,
      size: 5,
      points: 1
    });
  }

  use() {
    // TODO
    // increment score
  }
}
