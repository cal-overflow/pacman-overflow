export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.players = [];
    this.walls = [];
    this.interval = undefined;

    this.ctx.fillStyle = '#FFFFFF';
  }

  addPlayer(player) {
    this.players.push(player);
    // TODO: Game class should determine a safe spawn point for this player
    player.spawn({ x: 30, y: 30 });
  }

  removePlayer(playerToRemove) {
    this.players = this.players.filter((player) => player.id !== playerToRemove.id);
  }

  addWall(wall) {
    this.walls.push(wall);
  }

  removeWall(wallToRemove) {
    this.walls = this.walls.filter((wall) => wall.id !== wallToRemove.id);
  }

  start() {
    this.interval = setInterval(() => {
      this.update();
    }, 10);
  }

  end() {
    // TODO - this is only the basic endgame logic. Implement scoring etc.
    clearInterval(this.interval);
    this.interval = undefined;
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // draw walls
    for (let i = 0; i < this.walls.length; i++) {
      this.walls[i].draw(this.ctx);
    }

    // draw players
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      player.move();
      player.draw(this.ctx);
    }

    // TODO: implement collision detection
  }
}
