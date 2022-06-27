import Game from '@/backend/utilities/Game.js';
import { Player } from '@/backend/utilities/Players';
import Chance from 'chance';

const map = require('@/backend/assets/map.json');
const chance = new Chance();

describe('Game', () => {
  const totalItems = map.items.dots.length + map.items.powerPills.length;
  let game;

  beforeEach(() => {
    game = new Game({ map });
  });
  afterEach(jest.clearAllMocks);

  it('creates a game object correctly values', () => {
    expect(game.players).toEqual([]);
    expect(game.items).toHaveLength(totalItems);
    expect(game.intersections).toHaveLength(map.intersections.length);
    expect(game.map).toMatchObject(map);
    expect(game.interval).toBeUndefined();
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
