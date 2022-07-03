import Path from '../Path.js';
import Intersection from '../Intersection.js';
import Portal from '../Portal.js';

export default class Player {
  constructor() {
    // Find an alternative to 'id'. This is not random enough :(
    this.id = Math.floor(Math.random() * 100);
    this.name = 'Player';
    this.width = 30;
    this.height = 30;
    this.position = undefined;
    this.movement = { x: 0, y: 0 };
    this.score = 0;
    this.isCPU = true;
    this.pathToTarget = [];
  }

  spawn(path) {
    if (!path || !(path instanceof Path)) return;

    if (path.isHorizontal) {
      this.position = {
        x: (path.end.position.x + path.start.position.x) / 2,
        y: path.start.position.y
      };
    }
    else {
      this.position = {
        x: path.start.position.x,
        y: (path.start.position.y + path.end.position.y) / 2
      };
    }

    this.currentPath = path;
  }

  despawn() {
    this.stop();

    this.position = undefined;
    this.currentPath = undefined;
  }

  setMovement(movement) {
    if (this.isMovementDisabled && !movement.isCPUMove) return;

    if ((this.currentPath?.isHorizontal && movement.x) || (this.currentPath?.isVertical && movement.y)) {
      this.movement = {
        ...this.movement,
        ...movement
      };
      this.nextMovement = {}; // clear next movement
    }
    else {
      this.nextMovement = movement;
    }
  }

  move() {
    if (this.position) {
      if (this.currentPath instanceof Intersection) {
        let movementDetermined = false;

        if (this.nextMovement) {
          const newPath = this.currentPath.traverse(this.nextMovement);

          if (newPath && (this.canTraverseLair || !newPath.isLair)) {
            this.movement = this.nextMovement;
            this.nextMovement = undefined;
            this.currentPath = newPath;
            movementDetermined = true;
          }
        }

        if (!movementDetermined) {
          const newPath = this.currentPath.traverse(this.movement);

          if (newPath && (this.canTraverseLair || !newPath.isLair)) {
            if (newPath instanceof Portal) {
              return newPath.travel(this); // travel through the portal
            }

            this.currentPath = newPath;
          }
          else return this.stop();
        }
      }

      this.position.x += this.movement.x ?? 0;
      this.position.y += this.movement.y ?? 0;

      if (this.currentPath && this.currentPath instanceof Path) {
        if (this.currentPath.start.position.x === this.position.x && this.currentPath.start.position.y === this.position.y) {
          this.currentPath = this.currentPath.start;
        }
        else if (this.currentPath.end.position.x === this.position.x && this.currentPath.end.position.y === this.position.y) {
          this.currentPath = this.currentPath.end;
        }

      }
    }
  }

  teleport(intersection) {
    this.position = { ...intersection.position };
    this.currentPath = intersection;
  }

  stop() {
    this.movement = { x: 0, y: 0 };
  }

  incrementScore(points) {
    this.score += points;
  }

  getTargetPosition() { return; }

  reduce() {
    return {
      name: this.name,
      key: this.key,
      username: this.username,
      position: this.position,
      width: this.width,
      height: this.height,
      movement: this.movement,
      score: this.score,
      isScared: this.isScared,
      isCPU: this.isCPU,
      isPoweredUp: this.isPoweredUp,
      inRecovery: this.inRecovery,
      color: this.color,
    };
  }
}
