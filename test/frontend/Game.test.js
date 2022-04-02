import Game from '@/frontend/Game.js';
import Player from '@/frontend/Player.js';
import Wall from '@/frontend/Wall.js';
import Chance from 'chance';

const chance = new Chance();

describe('Game', () => {
  let game, ctxMock;

  beforeEach(() => {
    ctxMock = {
      fillStyle: '#000000',
      clearRect: jest.fn(),
      fillRect: jest.fn()
    };

    const mockCanvas = {
      getContext: () => ctxMock,
      width: chance.integer({ min: 100 }),
      height: chance.integer({ min: 100 })
    };

    game = new Game(mockCanvas);
  });

  it('creates a game with all default values', () => {
    expect(game.ctx).toMatchObject(ctxMock);
    expect(game.players).toEqual([]);
    expect(game.walls).toEqual([]);
    expect(game.interval).toBeUndefined();
  });

  describe('addPlayer() and removePlayer()', () => {
    let player;

    beforeEach(() => {
      player = new Player();
      game.addPlayer(player);
    });

    it('addPlayer() adds the player to the game players', () => {
      expect(game.players).toContain(player);
    });

    it('removePlayer() removes the player from the game players', () => {
      game.removePlayer(player);
      expect(game.players).not.toContain(player);
    });
  });
  
  describe('addWall() and removeWall()', () => {
    let wall;

    beforeEach(() => {
      wall = new Wall({
        x: chance.integer({ min: 0, max: 500 }),
        y: chance.integer({ min: 0, max: 500 }),
        width: chance.integer({ min: 10, max: 100 }),
        height: chance.integer({ min: 10, max: 100 })
      });

      game.addWall(wall);
    });

    it('addWall() adds the wall to the game walls', () => {
      expect(game.walls).toContain(wall);
    });

    it('removeWall() removes the wall from the game walls', () => {
      game.removeWall(wall);
      expect(game.walls).not.toContain(wall);
    });
  });
  
  describe('start()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      game.start();
    });

    it('sets the game interval', () => {
      expect(game.interval).not.toBeUndefined();
    });
  });
  
  describe('update()', () => {
    let players, walls;

    beforeEach(() => {
      players = chance.n(() => new Player(), chance.integer({ min: 1, max: 10 }));
      walls = chance.n(() => new Wall({}), chance.integer({ min: 1, max: 10 }));

      for (let i = 0; i < players.length; i++) {
        players[i].draw = jest.fn();
        game.addPlayer(players[i]);
      }

      for (let i = 0; i < walls.length; i++) {
        walls[i].draw = jest.fn();
        game.addWall(walls[i]);
      }

      game.update();
    });

    it('clears the canvas', () => {
      expect(ctxMock.clearRect).toBeCalled();
    });

    it('draws all walls', () => {
      for (let i = 0; i < walls.length; i++) {
        expect(walls[i].draw).toBeCalled();
      }
    });

    it('moves all players', () => {
      for (let i = 0; i < players.length; i++) {
        expect(players[i].draw).toBeCalled();
      }
    });
  });
  
  describe('end()', () => {

    beforeEach(() => {
      game.interval = chance.integer({ min: 0 });

      game.end();
    });

    it('resets the game interval', () => {
      expect(game.interval).toBeUndefined();
    });
  });
});
