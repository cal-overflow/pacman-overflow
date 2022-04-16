import Item from './Item.js';
import { PacMan } from '../Players/index.js';

export default class Dot extends Item {
  constructor(position) {
    super({
      position,
      size: 5,
      points: 1
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
