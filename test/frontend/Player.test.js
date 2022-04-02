import Player from '@/frontend/Player.js';
import Chance from 'chance';

const chance = new Chance();

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player();
  });

  it('creates a player with the correct default values', () => {
    expect(player).toMatchObject({
      isSpawned: false,
      movement: {
        x: 0,
        y: 0
      }
    });
  });

  describe('spawn()', () => {
    let position;

    beforeEach(() => {
      position = {
        x: chance.integer(),
        y: chance.integer()
      };

      player.spawn(position);
    });

    it('sets the player isSpawned value to true', () => {
      expect(player.isSpawned).toBeTruthy();
    });

    it('sets the player coordinates (position) correctly', () => {
      expect(player.position).toMatchObject(position);
    });
  });

  describe('despawn()', () => {
    beforeEach(() => {
      player.isSpawned = true;
      player.position = {
        x: chance.integer(),
        y: chance.integer()
      };
      player.movement = { x: -1, y: 0 };

      player.despawn();
    });

    it('sets the player isSpawned value to false', () => {
      expect(player.isSpawned).not.toBeTruthy();
    });

    it('clears the player position', () => {
      expect(player.position).toBeUndefined();
    });

    it('clears the player movement', () => {
      expect(player.movement).toMatchObject({
        x: 0,
        y: 0
      });
    });
  });

  describe('setMovement()', () => {
    it('sets the movement correctly given both x and y movement', () => {
      const movement = {
        x: chance.integer({ min: -1, max: -1 }),
        y: chance.integer({ min: -1, max: -1 })
      };

      player.setMovement(movement);

      expect(player.movement).toMatchObject(movement);
    });

    it('sets the movement correctly given only x movement', () => {
      player.movement.y = 0;

      const movement = { x: chance.integer({ min: -1, max: -1 }) };
      player.setMovement(movement);

      const expectedMovement = {
        ...movement,
        y: 0
      };

      expect(player.movement).toMatchObject(expectedMovement);
    });

    it('sets the movement correctly given only y movement', () => {
      player.movement.x = 0;

      const movement = { y: chance.integer({ min: -1, max: -1 }) };
      player.setMovement(movement);

      const expectedMovement = {
        ...movement,
        x: 0
      };

      expect(player.movement).toMatchObject(expectedMovement);
    });
  });

  describe('move()', () => {
    it('updates the player position according to the movement', () => {
      player.spawn({ x: chance.integer(), y: chance.integer() });
      player.setMovement({ x: 1, y: 0 });
      
      const expectedPosition = { x: player.position.x + 1, y: player.position.y };
      
      player.move();
      expect(player.position).toMatchObject(expectedPosition);
    });

    it('does not change position if player is not spawned', () => {
      player.move();
      expect(player.position).toBeUndefined();
    });
  });

  describe('draw()', () => {
    let ctxMock;

    beforeEach(() => {
      player.position = {
        x: chance.integer(),
        y: chance.integer()
      };

      ctxMock = {
        rect: jest.fn(),
        stroke: jest.fn()
      };

      player.draw(ctxMock);
    });

    it('calls the ctx rect() method correctly', () => {
      expect(ctxMock.rect).toBeCalled();
      expect(ctxMock.rect).toBeCalledWith(
        player.position.x,
        player.position.y,
        player.width,
        player.height
      );
    });

    it('calls the ctx stroke method', () => {
      expect(ctxMock.stroke).toBeCalled();
    });
  });

  describe('stop()', () => {
    beforeEach(() => {
      player.stop();
    });

    it('resets player movement', () => {
      expect(player.movement).toMatchObject({
        x: 0,
        y: 0
      });
    });
  });
});
