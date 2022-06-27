import Game from './Game.js';
import { PacMan, Blinky, Clyde, Inky, Pinky } from './Players/index.js';

const UPDATE_INTERVAL = 4;

export default class PacManGame extends Game {
  constructor({ map }) {
    super({ map });

    const pacman = new PacMan();
    pacman.isCPU = false; // TODO: delete
    const blinky = new Blinky();
    const clyde = new Clyde();
    const inky = new Inky();
    const pinky = new Pinky();

    this.addPlayer(pacman);
    this.addPlayer(blinky);
    this.addPlayer(clyde);
    this.addPlayer(inky);
    this.addPlayer(pinky);
  }

  start(sendGameDataCallback) {
    this.interval = setInterval(() => {
      const { haveItemsUpdated } = this.update();

      // after initial data send, only send items on update
      sendGameDataCallback({
        players: this.players.map((player) => player.reduce()),
        items: haveItemsUpdated ? this.items : undefined,
        textElements: this.textElements,
      });
    }, UPDATE_INTERVAL);
  }
}
