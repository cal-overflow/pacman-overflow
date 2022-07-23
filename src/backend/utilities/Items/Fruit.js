import Ghost from '../Players/Ghost.js';
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

  use(player) {
    if (player instanceof Ghost) {
      this.points = 2 * this.points;
      if (player.isScared) {
        this.points = 2 * this.points;
      }
    }
    player.incrementScore(this.points);
    return true;
  }
}
