import Item from './Item.js';
import { PacMan } from '../Players/index.js';

export default class PowerPill extends Item {
  constructor(position) {
    super({
      type: 'powerpill',
      position,
      size: 12,
      points: 0,
      isFlashing: true,
    });
  }

  use(player) {
    return player instanceof PacMan;
  }
}
