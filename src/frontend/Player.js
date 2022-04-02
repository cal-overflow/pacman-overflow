export default class Player {
  constructor() {
    this.isSpawned = false;
    this.movement = { x: 0, y: 0 };
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

  move() {
    if (this.isSpawned) {
      this.position.x += this.movement.x;
      this.position.y += this.movement.y;
    }
  }

  stop() {
    this.setMovement({ x: 0, y: 0 });
  }
}
