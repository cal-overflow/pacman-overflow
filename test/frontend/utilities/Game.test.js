import Game from '@/frontend/utilities/Game.js';
import { Player } from '@/frontend/utilities/Players';
import Chance from 'chance';

const chance = new Chance();


describe('Game', () => {
  let game, foregroundCtxMock, playerCtxMock;

  beforeEach(() => {
    foregroundCtxMock = {
      fillStyle: '#000000',
      clearRect: jest.fn(),
      fillRect: jest.fn()
    };

    playerCtxMock = {
      fillStyle: '#000000',
      clearRect: jest.fn(),
      fillRect: jest.fn()
    };

    const generateMockCanvas = (ctxMock) => ({
      getContext: () => ctxMock,
      width: chance.integer({ min: 100 }),
      height: chance.integer({ min: 100 })
    });

    game = new Game(generateMockCanvas(foregroundCtxMock), generateMockCanvas(playerCtxMock));
  });

  it('creates a game with all default values', () => {
    expect(game.foregroundCtx).toMatchObject(foregroundCtxMock);
    expect(game.playerCtx).toMatchObject(playerCtxMock);
    expect(game.players).toEqual([]);
    expect(game.paths).toEqual([]);
    expect(game.intersections).toEqual([]);
    expect(game.interval).toBeUndefined();
  });

  describe('loadGameBoard()', () => {});

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
