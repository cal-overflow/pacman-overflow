import Intersection from './Intersection.js';
import { Dot, Fruit, PowerPill } from './Items/index.js';
import { Ghost, PacMan } from './Players/index.js';
import Text from './Text.js';
import Path from './Path.js';
import Portal from './Portal.js';

const POWER_UP_DURATION = 7500;
const POINT_TEXT_VISIBILITY_DURATION = 1200;

export default class Game {
  constructor({ map }) {
    this.players = [];
    this.intersections = [];
    this.paths = [];
    this.items = [];
    this.textElements = [];
    this.interval = undefined;
    this.powerUpInterval = undefined;
    this.map = map;

    this.#loadGameBoard(map);
  }

  #loadGameBoard(map) {
    for (const configuration of map.intersections) {
      this.intersections.push(new Intersection(configuration));
    }

    this.#generatePaths(map);
    this.#generateItems(map);
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

  #createTextElement({ value, position, color, size }) {
    const textElement = new Text({
      position, 
      value: `${value}`,
      color,
      size
    });
    this.textElements.push(textElement);

    setTimeout(() => {
      const index = this.textElements.indexOf(textElement);
      this.textElements.splice(index, 1);
    }, POINT_TEXT_VISIBILITY_DURATION);
  }

  addPlayer(player) {
    this.players.push(player);

    player.spawn(this);
  }

  removePlayer(playerToRemove) {
    this.players = this.players.filter((player) => player.id !== playerToRemove.id);
  }

  start() {
    if (!this.interval) {
      this.interval = setInterval(() => this.update(), 1);
    }
  }

  end() {
    clearInterval(this.interval);
    this.interval = undefined;
    this.isOver = true;
  }

  update() {
    // handle CPU logic as needed and move all players
    for (const player of this.players) {
      if (player.isCPU || player.inRecovery) this.#setCPUMovement(player);

      player.move();
    }
    
    // handle collisions
    const { haveItemsUpdated, havePlayersDied } = this.#collisionHandler();

    if (havePlayersDied) {
      for (const player of this.players) {
        if (!player.position) player.spawn(this);
      }
    }

    if (haveItemsUpdated) {
      if (this.items.filter((item) => !(item instanceof Fruit)).length === 0) {
        this.end();
      }
      else if (this.items.length % 40 === 0 && Math.floor(Math.random() * 2)) {
        if (!this.items.includes((item) => item instanceof Fruit)) {
          this.items.push(new Fruit({ x: 448, y: 560 }));
        }
      }
    }

    return { haveItemsUpdated };
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
        if (ghost.position && !ghost.inRecovery) {
          let isCollision = false;

          if (pacman.position.x === ghost.position.x) {
            isCollision = Math.abs(pacman.position.y - ghost.position.y) < ((pacman.height / 2) + (ghost.height / 2));
          }
          else if (pacman.position.y === ghost.position.y) {
            isCollision = Math.abs(pacman.position.x - ghost.position.x) < ((pacman.width / 2) + (ghost.width / 2));
          }

          if (isCollision) {
            decisions.havePlayersDied = true;
            if (pacman.isPoweredUp && ghost.isScared) {
              this.#createTextElement({ value: 100, position: { ...ghost.position }, color: ghost.color });
              pacman.incrementScore(100);
              ghost.recover();
            }
            else {
              this.#createTextElement({ value: 150, position: { ...pacman.position }, color: pacman.color });
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
              else if (item instanceof Fruit) {
                this.#createTextElement({ value: item.points, position: item.position });
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

  #setCPUMovement(player) {
    if (!player.isCPU && !player.inRecovery) return;

    if (player instanceof Ghost) {
      if (!player.travelModeToggleTimeoutId) {
        player.toggleTravelMode();
      }
      if (player.inRecovery && player.currentPath.isLair) {
        return player.endRecovery();
      }
    }

    if (player.currentPath instanceof Intersection || (!player.movement?.x && !player.movement?.y)) {
      if (!player.pathToTarget.length || Math.random() < 0.25) {
        // there is a random chance the CPU gives up its current target/path and looks for new one
        const targetPosition = player.getTargetPosition(this);

        player.pathToTarget = this.#findPath(player, targetPosition);
      }

      if (player.pathToTarget.length) {
        // Remove the first intersection if the player is already at it
        if (player.position.x === player.pathToTarget[0].position.x && player.position.y === player.pathToTarget[0].position.y && player.pathToTarget.length > 1) {
          player.pathToTarget.shift();
        }
        
        const nextIntersection = player.pathToTarget.shift();
        const isTravelingThroughPortal = player.currentPath instanceof Intersection && player.currentPath.getPathToNeighbor(nextIntersection) instanceof Portal;

        if (!isTravelingThroughPortal) {
          if (player.position.x === nextIntersection.position.x) {
            player.setMovement({
              y: (player.position.y < nextIntersection.position.y) ? 1 : -1,
              isCPUMove: true
            });
          }
          else {
            player.setMovement({
              x: (player.position.x < nextIntersection.position.x) ? 1 : -1,
              isCPUMove: true
            });
          }
        }
      }
      player.move();
    }
  }

  #findPath(player, target) {
    if (!player || !target) return [];
    const { currentPath } = player;

    let start = {};

    if (!(currentPath instanceof Intersection)) {
      const distanceStartToTarget = Math.abs(target.x - currentPath.start.position.x) + Math.abs(target.y - currentPath.start.position.y);
      const distanceEndToTarget = Math.abs(target.x - currentPath.end.position.x) + Math.abs(target.y - currentPath.end.position.y);

      start = currentPath[(distanceStartToTarget < distanceEndToTarget) ? 'start' : 'end'];
    }
    else start = currentPath;

    // check if target is on intersection
    for (const intersection of this.intersections) {
      if (target.x === intersection.position.x && target.y === intersection.position.y) {
        target = intersection;
        break;
      }
    }
    if (!(target instanceof Intersection)) {
      for (const path of this.paths) {
        if (path.containsPosition(target)) {
          if (path.isHorizontal) {
            target = player.position.x < target.x ? path.end : path.start;
          }
          else {
            target = player.position.y < target.y ? path.end : path.start;
          }
          break;
        }
      }
      
    }

    if (start.position === target.position) {
      return [start];
    }

    return this.#travelToGoal({ player, start, target });
  }

  #travelToGoal({ player, start, target }) {
    if (!player || !start || !target) return [];

    const distances = {};
    const previous = {};

    for (const intersection of this.intersections) {
      distances[intersection.key] = Infinity;
      previous[intersection.key] = undefined;
    }
    distances[start.key] = 0;

    const queue = [...this.intersections]; // copy intersections into queue

    while (queue.length) {
      let smallestDistance = Infinity;
      let nodeWithSmallestDistance;

      // find the current node (still in queue) with smallest distance
      for (const node of queue) {
        if (distances[node.key] < smallestDistance) {
          nodeWithSmallestDistance = node;
          smallestDistance = distances[node.key];
        }
      }

      // remove current node from queue
      const currentNodeIndex = queue.findIndex((node) => node.key == nodeWithSmallestDistance.key);
      const current = queue.splice(currentNodeIndex, 1)[0];
      
      for (const neighbor of current.getNeighbors()) {
        // skip neighbors already visited (not in queue)
        if (!queue.find((node) => node.key === neighbor.key)) continue;
        const pathConnectingNodes = current.getPathToNeighbor(neighbor);
        const totalDistanceFromStart = distances[current.key] + this.#getWeightOfPath(player, pathConnectingNodes);

        if (totalDistanceFromStart < distances[neighbor.key]) {
          distances[neighbor.key] = totalDistanceFromStart;
          previous[neighbor.key] = current;
        }
      }
    }

    const pathToStartFromTarget = [];
    let currentNode = target;
    // create a list of intersections from start to end, working backward
    while (currentNode) {
      pathToStartFromTarget.push(currentNode);

      currentNode = previous[currentNode.key]; // will be set to undefined when on start node
    }

    return pathToStartFromTarget.reverse();
  }

  #getWeightOfPath(player, path) {
    let threatCount = 0;
    const threatWeightMultiplier = 10;

    if (player instanceof PacMan) {
      if (player.isPoweredUp) return path.weight;

      for (const ghost of this.players) {
        if (ghost instanceof PacMan) continue;

        if (path.containsPosition(ghost.position)) {
          threatCount++;
        }
      }

      return path.weight + (threatCount * path.weight * threatWeightMultiplier);
    }
    else if (player.isScared) {

      const pacman = this.players.find((player) => player instanceof PacMan);
      if (path.containsPosition(pacman.position)) {
        return path.weight * threatWeightMultiplier;
      }
    }

    return path.weight;
  }
}
