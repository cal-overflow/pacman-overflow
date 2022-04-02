export default class Player {
  constructor() {
    this.id = Math.floor(Math.random() * 100);
    this.width = 20;
    this.height = 20;
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

  draw(ctx) {
    ctx.rect(this.position.x, this.position.y, this.width, this.height);
    ctx.stroke();
  }

  stop() {
    this.setMovement({ x: 0, y: 0 });
  }
}
