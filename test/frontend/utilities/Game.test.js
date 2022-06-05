import Game from '@/frontend/utilities/Game.js';
import { Item } from '@/frontend/utilities/Items';
import { Player } from '@/frontend/utilities/Players';
import Chance from 'chance';

const map = require('@/frontend/assets/map.json');
const chance = new Chance();

const generateMockCanvas = (ctxMock) => ({
  getContext: () => ctxMock,
  width: chance.integer({ min: 100 }),
  height: chance.integer({ min: 100 })
});

describe('Game', () => {
  const totalItems = map.items.dots.length + map.items.powerPills.length;
  let game, foregroundCtxMock, playerCtxMock, itemDrawMock;

  beforeEach(() => {
    itemDrawMock = jest.spyOn(Item.prototype, 'draw');

    foregroundCtxMock = {
      fillStyle: '#000000',
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn()
    };

    playerCtxMock = {
      fillStyle: '#000000',
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn()
    };

    game = new Game({ foregroundCanvas: generateMockCanvas(foregroundCtxMock), playerCanvas: generateMockCanvas(playerCtxMock), map });
  });
  afterEach(jest.clearAllMocks);

  it('creates a game object correctly values', () => {
    expect(game.foregroundCtx).toMatchObject(foregroundCtxMock);
    expect(game.playerCtx).toMatchObject(playerCtxMock);
    expect(game.players).toEqual([]);
    expect(game.items).toHaveLength(totalItems);
    expect(game.intersections).toHaveLength(map.intersections.length);
    expect(game.map).toMatchObject(map);
    expect(game.interval).toBeUndefined();
  });

  it('should draw each of the items', () => {
    expect(itemDrawMock).toHaveBeenCalledTimes(totalItems);
  });

  describe('addPlayer()', () => {
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
    it.todo('moves the players');

    describe('given a player dies', () => {
      it.todo('respawns the player');
    });

    describe('given a player dies', () => {
      it.todo('respawns the player');
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
