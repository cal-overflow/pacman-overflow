import Item from './Item.js';
import { PacMan } from '../Players/index.js';

export default class PowerPill extends Item {
  constructor(position) {
    super({
      position,
      size: 12,
      points: 0
    });
  }

  use(player) {
    return player instanceof PacMan;
  }
}
