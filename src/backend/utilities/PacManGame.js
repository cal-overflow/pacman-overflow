import Game from './Game.js';
import { PacMan, Blinky, Clyde, Inky, Pinky } from './Players/index.js';

const UPDATE_INTERVAL = 4;

export default class PacManGame extends Game {
  constructor({ map }) {
    super({ map });

    const pacman = new PacMan();
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

  start(sendGameDataCallback, gameEndCallback) {
    this.interval = setInterval(() => {
      const { haveItemsUpdated } = this.update();

      sendGameDataCallback(this.reduce({ includeItems: haveItemsUpdated }));
    }, UPDATE_INTERVAL);

    this.gameEndCallback = gameEndCallback;
  }

  end() {
    super.end();
    this.gameEndCallback(this.reduce({}));
  }

  reduce({ includeItems=false }) {
    return {
      players: this.players.map((player) => player.reduce()),
      items: includeItems ? this.items : undefined,
      textElements: this.textElements
    };
  }
}
