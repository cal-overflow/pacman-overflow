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
      this.position.x += this.movement.x;
      this.position.y += this.movement.y;
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.width, this.height);
  }

  stop() {
    this.setMovement({ x: 0, y: 0 });
  }

  setUnavailableMovements(unavailableMovements) {
    this.unavailableMovements = unavailableMovements;
  }
}
