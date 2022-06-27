import Item from './Item.js';
import { PacMan } from '../Players/index.js';

export default class Dot extends Item {
  constructor(position) {
    super({
      type: 'dot',
      position,
      size: 5,
      points: 5
    });
  }

  use(player) {
    if (player instanceof PacMan) {
      player.incrementScore(this.points);

      return true;
    }

    return false;
  }
}
