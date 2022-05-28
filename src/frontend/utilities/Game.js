import Intersection from './Intersection.js';
import { Dot, Fruit, PowerPill } from './Items/index.js';
import { Ghost, PacMan } from './Players/index.js';
import Path from './Path.js';
import Portal from './Portal.js';

const POWER_UP_DURATION = 7500;

export default class Game {
  constructor(foregroundCanvas, playerCanvas) {
    this.foregroundCtx = foregroundCanvas.getContext('2d');
    this.playerCtx = playerCanvas.getContext('2d');
    this.players = [];
    this.intersections = [];
    this.paths = [];
    this.items = [];
    this.interval = undefined;
    this.powerUpInterval = undefined;

    this.board = {
      width: foregroundCanvas.width,
      height: foregroundCanvas.height
    };

    this.foregroundCtx.fillStyle = '#FFFFFF';
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
    // for (const intersection of this.intersections) {
    //   intersection.draw(this.foregroundCtx);
    // }

    // draw paths (dev purposes only, will change)
    // for (const path of this.paths) {
    //   path.draw(this.foregroundCtx);
    // }

    // draw items
    for (const item of this.items) {
      item.draw(this.foregroundCtx);
    }
  }

  #generatePaths({ inaccessiblePaths, portals, lairPaths }) {
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
          const endPortal = (intersections[1].x === end.position.x && intersections[1].y === end.position.y);
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

          const isLairPath = lairPaths.find((intersections) => {
            const startIntersection = (intersections[0].x === start.position.x && intersections[0].y === start.position.y);
            const endIntersection = (intersections[1].x === end.position.x && intersections[1].y === end.position.y);
            return startIntersection && endIntersection;
          });

          if (!isInaccessiblePath) {
            this.paths.push(new Path(start, end, isLairPath));
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

    this.#spawnPlayer(player);
  }

  #spawnPlayer(player) {
    for (const path of this.paths) {
      const isMatchingStart = path.start.position.x === player.spawnPath[0].x && path.start.position.y === player.spawnPath[0].y;
      const isMatchingEnd = path.end.position.x === player.spawnPath[1].x && path.end.position.y === player.spawnPath[1].y;

      if (isMatchingStart && isMatchingEnd) {
        player.spawn(path);
      }
    }
  }

  removePlayer(playerToRemove) {
    this.players = this.players.filter((player) => player.id !== playerToRemove.id);
  }

  start() {
    this.interval = setInterval(() => this.update(), 1);
  }

  end() {
    clearInterval(this.interval);
    this.interval = undefined;
    
    // dev purposes only (TODO: remove)
    for (const player of this.players) {
      console.log(`${player.constructor.name}: ${player.score}`);
    }
  }

  update() {
    this.playerCtx.clearRect(0, 0, this.board.width, this.board.height);

    // move each player and AI behavior
    for (const player of this.players) {
      // TODO: put if (player.isCPU) logic here

      player.move();
    }
    
    // handle collisions
    const { haveItemsUpdated, havePlayersDied } = this.#collisionHandler();

    if (havePlayersDied) {
      for (const player of this.players) {
        if (!player.position) this.#spawnPlayer(player);
      }
    }

    if (haveItemsUpdated) {
      this.foregroundCtx.clearRect(0, 0, this.board.width, this.board.height);

      if (this.items.filter((item) => !(item instanceof Fruit)).length === 0) {
        this.end();
      }
      else if (this.items.length % 40 === 0 && Math.floor(Math.random() * 2)) {
        if (!this.items.includes((item) => item instanceof Fruit)) {
          this.items.push(new Fruit({ x: 448, y: 560 }));
        }
      }
      
      for (const item of this.items) {
        item.draw(this.foregroundCtx);
      }
    }

    for (const player of this.players) {
      if (player.position) player.draw(this.playerCtx);
    }

    // TODO: move this to the for loop at the top of the function. This is only here for debugging purposes
    for (const player of this.players) {
      if (player.isCPU) {
        const targetPosition = player.getTargetPosition(this);
        
        // TODO: delete (debugging)
        if (targetPosition) {
          // console.log(targetPosition);
          if (player instanceof PacMan) {
            this.playerCtx.fillStyle = '#FF0000';
          }
          else this.playerCtx.fillStyle = '#808080';
          this.playerCtx.beginPath();
          this.playerCtx.arc(targetPosition.x, targetPosition.y, 8, 0, 2 * Math.PI);
          this.playerCtx.fill();

          this.playerCtx.stroke();
        }

        const paths = this.#findPath(targetPosition);

        // DEBUGGING - TODO: delete this
        if (paths) {
          console.log(paths);
          for (const path in paths) {
            this.foregroundCtx.fillStyle = '#ff0000';
            path.draw(this.foregroundCtx);
          }
        }
        else console.log('no path returned');
        // end of debugging

        // TODO
        // using the paths (list of path objects), set this player movement accordingly
      }
    }
  }

  #collisionHandler() {
    const decisions = {
      havePlayersDied: false,
      haveItemsUpdated: false
    };

    
    const pacman = this.players.find((player) => player instanceof PacMan);
    const ghosts = this.players.filter((player) => player instanceof Ghost);

    if (pacman.position) {
      for (let i = 0; i < ghosts.length; i++) {
        const ghost = ghosts[i];
        if (ghost.position) {
          let isCollision = false;

          if (pacman.position.x === ghost.position.x) {
            isCollision = Math.abs(pacman.position.y - ghost.position.y) < ((pacman.height / 2) + (ghost.height / 2));
          }
          else if (pacman.position.y === ghost.position.y) {
            isCollision = Math.abs(pacman.position.x - ghost.position.x) < ((pacman.width / 2) + (ghost.width / 2));
          }

          if (isCollision) {
            decisions.havePlayersDied = true;
            if (pacman.isPoweredUp) {
              pacman.incrementScore(100);
              ghost.despawn();
            }
            else {
              ghost.incrementScore(150);
              pacman.despawn();
              break;
            }
          }
        }
      }
    }

    for (const player of this.players) {
      if (player.position) {
        for (const item of this.items) {
          if (player.position.x === item.position.x && player.position.y === item.position.y) {
            const itemWasUsed = item.use(player);
  
            if (itemWasUsed) {
              // remove this item from the game's items
              this.items = this.items.filter(({ position }) => {
                return !(position.x === item.position.x && position.y === item.position.y);
              });
  
              if (item instanceof PowerPill) {
                this.#triggerPowerUp();
              }
  
              decisions.haveItemsUpdated = true;
            }
            break;
          }
        }
      }
    }

    return decisions;
  }

  #triggerPowerUp() {
    for (const player of this.players) {
      if (player instanceof PacMan) {
        player.isPoweredUp = true;
      }
      
      if (player instanceof Ghost) {
        player.isScared = true;
      }
    }

    // clear and reset the timeout if there is already one
    if (this.powerUpInterval) {
      clearTimeout(this.powerUpInterval);
      this.powerUpInterval = undefined;
    }

    this.powerUpInterval = setTimeout(() => {
      // update each player's status property
      for (const player of this.players) {
        if (player instanceof PacMan) {
          player.isPoweredUp = false;
        }
        
        if (player instanceof Ghost) {
          player.isScared = false;
        }
      }

      this.powerUpInterval = undefined;
    }, POWER_UP_DURATION);
  }

  #findPath(targetPosition) {
    if (!targetPosition) return;
    // TODO
  }
}
