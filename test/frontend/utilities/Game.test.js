import Game from '@/frontend/utilities/Game.js';
import Player from '@/frontend/utilities/Player.js';
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
    let players;

    beforeEach(() => {
      players = chance.n(() => new Player(), chance.integer({ min: 1, max: 10 }));

      for (let i = 0; i < players.length; i++) {
        players[i].draw = jest.fn();
        game.addPlayer(players[i]);
      }

      game.update();
    });

    it('clears the canvas', () => {
      expect(ctxMock.clearRect).toBeCalled();
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
