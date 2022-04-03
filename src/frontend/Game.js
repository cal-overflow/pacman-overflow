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
    player.spawn({ x: 16, y: 16 });
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
    this.handleMovementAndCollisions();

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
  }

  // Currently only handles collisions between players and walls
  handleMovementAndCollisions() {
    const wallCushion = 5;
    for (const player of this.players) {
      // if player is trying to move, let them move as long as they aren't moving into wall
      const unavailableMovements = {};

      for (const wall of this.walls) {
        let wallXRange = [wall.x, wall.x + wall.width];
        let wallYRange = [wall.y, wall.y + wall.height];
        let playerXRange = [player.position.x - (player.width / 2), player.position.x + (player.width / 2)];
        let playerYRange = [player.position.y - (player.height / 2), player.position.y + (player.height / 2)];

        if ((wallXRange[0] <= playerXRange[0] && playerXRange[0] <= wallXRange[1]) || (wallXRange[0] <= playerXRange[1] && playerXRange[1] <= wallXRange[1]) ||
            (playerXRange[0] <= wallXRange[0] && wallXRange[0] <= playerXRange[1]) || (playerXRange[0] <= wallXRange[1] && wallXRange[1] <= playerXRange[1])) {
          // in x range (can run into wall via y axis)

          if (Math.abs(playerYRange[0] - wallYRange[0]) <= wallCushion || Math.abs(playerYRange[1] - wallYRange[0]) <= wallCushion) {
            if (player.movement.y == 1) {
              player.stop();
            }
            
            unavailableMovements.y = 1;
          }

          if (Math.abs(playerYRange[0] - wallYRange[1]) <= wallCushion || Math.abs(playerYRange[1] - wallYRange[1]) <= wallCushion) {
            if (player.movement.y == -1) {
              player.stop();
            }

            unavailableMovements.y = -1;
          }
        }
        
        if ((wallYRange[0] <= playerYRange[0] && playerYRange[0] <= wallYRange[1]) || (wallYRange[0] <= playerYRange[1] && playerYRange[1] <= wallYRange[1]) ||
        (playerYRange[0] <= wallYRange[0] && wallYRange[0] <= playerYRange[1]) || (playerYRange[0] <= wallYRange[1] && wallYRange[1] <= playerYRange[1])) {
          // in y range (can run into wall via x axis)
          
          if (Math.abs(playerXRange[0] - wallXRange[0]) <= wallCushion || Math.abs(playerXRange[1] - wallXRange[0]) <= wallCushion) {
            if (player.movement.x == 1) {
              player.stop();
            }

            unavailableMovements.x = 1;
          }

          if (Math.abs(playerXRange[0] - wallXRange[1]) <= wallCushion || Math.abs(playerXRange[1] - wallXRange[1]) <= wallCushion) {
            if (player.movement.x == -1) {
              player.stop();
            }

            unavailableMovements.x = -1;
          }
        }
      }

      if (player.nextMovement.x && player.nextMovement.x !== player.unavailableMovements.x) {
        player.switchToNextMovement();
      }
      else if (player.nextMovement.y && player.nextMovement.y !== player.unavailableMovements.y) {
        player.switchToNextMovement();
      }

      player.setUnavailableMovements(unavailableMovements);
    }
  }
}
