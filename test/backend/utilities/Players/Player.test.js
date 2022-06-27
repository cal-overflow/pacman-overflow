import Intersection from '@/backend/utilities/Intersection';
import Path from '@/backend/utilities/Path.js';
import Player from '@/backend/utilities/Players/Player.js';
import Chance from 'chance';

const chance = new Chance();

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player();
  });

  it('creates a player with the correct default values', () => {
    expect(player).toMatchObject({
      movement: {
        x: 0,
        y: 0
      }
    });
  });

  describe('spawn()', () => {
    let path, start, end;

    beforeEach(() => {
      start = new Intersection({ x: 0, y: 0 });
      end = new Intersection({ x: 0, y: chance.integer({ min: 10, max: 100 }) });
      path = new Path(start, end);

      player.spawn(path);
    });

    it('sets the player coordinates (position) correctly', () => {
      const expectedSpawnPoint = {
        x: 0,
        y: (start.position.y + end.position.y) / 2
      };

      expect(player.position).toMatchObject(expectedSpawnPoint);
    });

    it('sets the currentPath value correctly', () => {
      expect(player.currentPath).toEqual(path);
    });

    it('sets the isCPU property to true by default', () => {
      expect(player.isCPU).toBeTruthy();
    });

    it('sets the pathToTarget value correctly', () => {
      expect(player.pathToTarget).toHaveLength(0);
    });
  });

  describe('despawn()', () => {
    beforeEach(() => {
      player.position = {
        x: chance.integer(),
        y: chance.integer()
      };
      player.movement = { x: -1, y: 0 };
      player.currentPath = chance.integer();

      player.despawn();
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

    it('clears the player currentPath', () => {
      expect(player.currentPath).toBeUndefined();
    });
  });

  describe('setMovement()', () => {
    describe('given the player tries moving along the wrong axis', () => {
      beforeEach(() => {
        player.currentPath = { isHorizontal: true };

        player.setMovement({ y: 1 });
      });

      it('sets the nextMovement value correctly', () => {
        expect(player.nextMovement).toMatchObject({ y: 1 });
      });
    });

    describe('given the player tries moving along the axis (path) correctly', () => {
      beforeEach(() => {
        player.currentPath = { isHorizontal: true };

        player.setMovement({ x: 1 });
      });

      it('updates their movement correctly', () => {
        expect(player.movement).toMatchObject({ x: 1, y: 0 });
      });
    });
  });

  describe('move()', () => {
    let path, start, end;

    beforeEach(() => {
      start = new Intersection({ x: 0, y: 0 });
      end = new Intersection({ x: 0, y: chance.integer({ min: 10, max: 100 }) });
      path = new Path(start, end);

      player.spawn(path);
    });

    it('updates the player position according to the movement', () => {
      player.setMovement({ x: 0, y: 1 });
      
      const expectedPosition = { x: player.position.x, y: player.position.y + 1 };
      
      player.move();
      expect(player.position).toMatchObject(expectedPosition);
    });

    it('does not change position if player is not spawned', () => {
      player.despawn();

      player.move();
      expect(player.position).toBeUndefined();
    });
  });

  describe('teleport()', () => {
    let intersection;

    beforeEach(() => {
      intersection = new Intersection({
        x: chance.integer(),
        y: chance.integer()
      });

      player.teleport(intersection);
    });

    it('changes the player position to that of the intersection provided', () => {
      expect(player.position).toMatchObject(intersection.position);
    });

    it('changes the player currentPath to that of the intersection provided', () => {
      expect(player.currentPath).toMatchObject(intersection);
    });
  });

  describe('incrementScore()', () => {
    let points;

    beforeEach(() => {
      points = chance.integer({ min: 1 });
      
      player.score = 0;
      player.incrementScore(points);
    });

    it('increments the player score correctly', () => {
      expect(player.score).toEqual(points);
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
