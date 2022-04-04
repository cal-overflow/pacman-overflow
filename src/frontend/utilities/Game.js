import Path from './Path.js';

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.players = [];
    this.intersections = [];
    this.paths = [];
    this.interval = undefined;

    this.ctx.fillStyle = '#FFFFFF';
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

  initializeBoard(intersections) {
    this.intersections = intersections;

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

        if (isBestPath) {
          const path = new Path(start, end);
          start.addPath(path);
          end.addPath(path);
          this.paths.push(path);
        }
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // draw intersections (dev purposes only, will change)
    for (const intersection of this.intersections) {
      intersection.draw(this.ctx);
    }

    // draw paths (dev purposes only, will change)
    for (const path of this.paths) {
      path.draw(this.ctx);
    }

    // draw players
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      player.move();
      player.draw(this.ctx);
    }
  }
}
