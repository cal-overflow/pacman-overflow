export default class Player {
  constructor() {
    this.id = Math.floor(Math.random() * 100);
    this.width = 20;
    this.height = 20;
    this.isSpawned = false;
    this.movement = { x: 0, y: 0 };
    this.nextMovement = {};
  }

  spawn(position) {
    this.position = position;
    this.isSpawned = true;
  }

  despawn() {
    this.stop();

    this.isSpawned = false;
    this.position = undefined;
  }

  setMovement(movement) {
    this.movement = {
      ...this.movement,
      ...movement
    };
  }

  setNextMovement(movement) {
    this.nextMovement = {
      x: movement.x ?? 0,
      y: movement.y ?? 0
    };
  }

  switchToNextMovement() {
    this.movement = { ...this.nextMovement };
    this.nextMovement = {};
  }

  move() {
    if (this.isSpawned) {
      const axis = this.position.path.horizontal ? 'x' : 'y';
      // check if we are at the edge of the path (x/y index matches path start or path end value)
      if (this.position[axis] === this.position.path.start || this.position[axis] === this.position.path.end) {
        this.stop();
      }

      if (this.nextMovement) {
        // see if it is possible to switch to next movement (change paths)
        if (this.nextMovement.y && this.position.path.vertical) {
          this.switchToNextMovement();
        }

        if (this.nextMovement.x & this.position.path.horizontal) {
          this.switchToNextMovement();
        }
      }

      this.position.x += this.movement.x;
      this.position.y += this.movement.y;
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.width, this.height);
    // ctx.fillStyle = '#000000';
    // ctx.fillRect(this.position.x - 1, this.position.y - 1, 2, 2);
  }

  stop() {
    this.setMovement({ x: 0, y: 0 });
  }

  // setUnavailableMovements(unavailableMovements) {
  //   this.unavailableMovements = unavailableMovements;
  // }
}
