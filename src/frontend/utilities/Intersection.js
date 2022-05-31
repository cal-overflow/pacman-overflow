import Portal from './Portal.js';

const directionsBetweenIntersections = {
  up: 'start',
  down: 'end',
  left: 'start',
  right: 'end',
  portal: {
    up: 'end',
    down: 'start',
    left: 'end',
    right: 'start'
  }
};

export default class Intersection {
  constructor(position) {
    this.key = JSON.stringify(position);
    this.position = position;
    this.paths = {};
  }

  addPath(path) {
    if (path instanceof Portal) {
      if (path.isHorizontal) {
        if (path.start === this) {
          this.paths.left = path;
        }
        else if (path.end === this) {
          this.paths.right = path;
        }
      }
      else  {
        if (path.start === this) {
          this.paths.up = path;
        }
        else if (path.end === this) {
          this.paths.down = path;
        }
      }
    }
    else {
      if (path.isHorizontal) {
        if (path.start === this) {
          this.paths.right = path;
        }
        else if (path.end === this) {
          this.paths.left = path;
        }
      }
      else  {
        if (path.start === this) {
          this.paths.down = path;
        }
        else if (path.end === this) {
          this.paths.up = path;
        }
      }
    }
  }
  
  traverse(movement) {
    if (movement.x) {
      if (movement.x === -1) {
        return this.paths.left;
      }
      if (movement.x === 1) {
        return this.paths.right;
      }
    }
    else if (movement.y) {
      if (movement.y === -1) {
        return this.paths.up;
      }
      if (movement.y === 1) {
        return this.paths.down;
      }
    }
  }

  getNeighbors() {
    const neighbors = [];

    for (const direction in directionsBetweenIntersections) {
      if (this.paths[direction]) {
        if (this.paths[direction] instanceof Portal) {
          neighbors.push(this.paths[direction][directionsBetweenIntersections.portal[direction]]);
        }
        else {
          neighbors.push(this.paths[direction][directionsBetweenIntersections[direction]]);
        }
      }
    }

    return neighbors;
  }
  
  getPathToNeighbor(neighbor) {
    if (!neighbor) return;

    for (const direction in directionsBetweenIntersections) {
      if (this.paths[direction]) {
        if (this.paths[direction] instanceof Portal) {
          if (this.paths[direction][directionsBetweenIntersections.portal[direction]].key === neighbor.key) {
            return this.paths[direction];
          }
        }
        else if (this.paths[direction][directionsBetweenIntersections[direction]].key === neighbor.key) {
          return this.paths[direction];
        }
      }
    }
  }
}
