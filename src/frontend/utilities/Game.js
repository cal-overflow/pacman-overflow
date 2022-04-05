import Intersection from './Intersection.js';
import { Dot, PowerPill } from './Items/index.js';
import Path from './Path.js';
import Portal from './Portal.js';

export default class Game {
  constructor(foregroundCanvas, playerCanvas) {
    this.foregroundCtx = foregroundCanvas.getContext('2d');
    this.playerCtx = playerCanvas.getContext('2d');
    this.players = [];
    this.intersections = [];
    this.paths = [];
    this.items = [];
    this.interval = undefined;

    this.board = {
      width: foregroundCanvas.width,
      height: foregroundCanvas.height
    };

    // TODO: change this
    this.foregroundCtx.fillStyle = '#FFFFFF';
    this.playerCtx.fillStyle = '#FFFFFF';
  }

  async loadGameBoard(path) {
    const res = await fetch(path);
    const map = await res.json();

    for (const configuration of map.intersections) {
      this.intersections.push(new Intersection(configuration));
    }

    this.#generatePaths(map);
    this.#generateItems(map);

    // draw intersections (dev purposes only, will change)
    for (const intersection of this.intersections) {
      intersection.draw(this.foregroundCtx);
    }

    // draw paths (dev purposes only, will change)
    for (const path of this.paths) {
      path.draw(this.foregroundCtx);
    }

    // draw items
    for (const item of this.items) {
      item.draw(this.foregroundCtx);
    }
  }

  #generatePaths({ inaccessiblePaths, portals }) {
    for (const start of this.intersections) {
      for (const end of this.intersections) {
        if (start === end || start.position.x > end.position.x || start.position.y > end.position.y) continue;

        let isBestPath = false; // assume there is a better path, or none at all

        if (start.position.x === end.position.x) {
          isBestPath = !this.intersections.find(({ position }) => {
            return start.position.x === position.x && start.position.y < position.y && position.y < end.position.y;
          });
        }
        else if (start.position.y === end.position.y) {
          isBestPath = !this.intersections.find(({ position }) => {
            return start.position.y === position.y && start.position.x < position.x && position.x < end.position.x;
          });
        }

        const isPortal = portals.find((intersections) => {
          const startPortal = (intersections[0].x === start.position.x && intersections[0].y === start.position.y);
          let endPortal = (intersections[1].x === end.position.x && intersections[1].y === end.position.y);
          return startPortal && endPortal;
        });

        if (isBestPath && !isPortal) {
          const isInaccessiblePath = inaccessiblePaths.find((intersections) => {
            const containsStart = intersections.find((intersection) => {
              return intersection.x === start.position.x && intersection.y === start.position.y;
            });

            const containsEnd = intersections.find((intersection) => {
              return intersection.x === end.position.x && intersection.y === end.position.y;
            });

            return containsStart &&  containsEnd;
          });

          if (!isInaccessiblePath) {
            this.paths.push(new Path(start, end));
          }
        }
        
        if (isPortal) {
          this.paths.push(new Portal(start, end));
        }
      }
    }
  }

  #generateItems({ items }) {
    for (const position of items.dots) {
      this.items.push(new Dot(position));
    }

    for (const position of items.powerPills) {
      this.items.push(new PowerPill(position));
    }
  }

  addPlayer(player) {
    this.players.push(player);

    // Spawn the player at the first safe path
    for (const path of this.paths) {
      if (path.isSafe) {
        player.spawn(path);
      }
    }
  }

  removePlayer(playerToRemove) {
    this.players = this.players.filter((player) => player.id !== playerToRemove.id);
  }

  start() {
    this.interval = setInterval(() => {
      this.update();
    }, 1);
  }

  end() {
    // TODO - this is only the basic endgame logic. Implement scoring etc.
    clearInterval(this.interval);
    this.interval = undefined;
  }

  update() {
    this.playerCtx.clearRect(0, 0, this.board.width, this.board.height);

    // move and draw players
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      player.move();
      player.draw(this.playerCtx);
    }
  }
}
