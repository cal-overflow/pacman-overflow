import Item from './Item.js';

export default class Fruit extends Item {
  constructor(position) {
    super({
      type: 'fruit',
      position,
      points: Math.round((Math.random() * 4) + 1) * 50,
      size: 16
    });
  }

  use() {
    return true;
  }
}
