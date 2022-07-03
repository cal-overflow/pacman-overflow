import Intersection from '@/backend/utilities/Intersection.js';
import Path from '@/backend/utilities/Path';
import Portal from '@/backend/utilities/Portal.js';
import Chance from 'chance';

const chance = new Chance();

describe('Intersection', () => {
  let intersection, position;

  beforeEach(() => {
    position = {
      x: chance.integer({ min: 0, max: 500 }),
      y: chance.integer({ min: 0, max: 500 })
    };

    intersection = new Intersection(position);
  });

  it('creates an intersection object correctly', () => {
    expect(intersection.key).toEqual(JSON.stringify(position));
    expect(intersection.position).toMatchObject(position);
    expect(intersection.paths).toMatchObject({});
  });

  describe('addPath()', () => {
    let path;

    describe('given a regular (non-portal) path', () => {
      describe('given a horizontal path', () => {
        beforeEach(() => {
          path = { isHorizontal: true };
        });
  
        it('it properly configures the left path', () => {
          path.end = intersection;
  
          intersection.addPath(path);
          expect(intersection.paths.left).toMatchObject(path);
        });
  
        it('it properly configures the right path', () => {
          path.start = intersection;
  
          intersection.addPath(path);
          expect(intersection.paths.right).toMatchObject(path);
        });
      });
      
      describe('given a vertical path', () => {
        beforeEach(() => {
          path = { isVertical: true };
        });
  
        it('it properly configures the up path', () => {
          path.end = intersection;
  
          intersection.addPath(path);
          expect(intersection.paths.up).toMatchObject(path);
        });
  
        it('it properly configures the down path', () => {
          path.end = intersection;
  
          intersection.addPath(path);
          expect(intersection.paths.up).toMatchObject(path);
        });
      });
    });

    describe('given a portal path', () => {
      let start, end;
      describe('given a horizontal path', () => {
        beforeEach(() => {
          start = new Intersection({ x: chance.integer({ min: 0, max: 99 }), y: 10 });
          end = new Intersection({ x: chance.integer({ min: 100, max: 500 }), y: 10 });
          path = new Portal(start, end);
        });
  
        it('it properly configures the left path', () => {
          path.start = intersection;
  
          intersection.addPath(path);
          expect(intersection.paths.left).toMatchObject(path);
        });
  
        it('it properly configures the right path', () => {
          path.end = intersection;
  
          intersection.addPath(path);
          expect(intersection.paths.right).toMatchObject(path);
        });
      });
      
      describe('given a vertical path', () => {
        beforeEach(() => {
          start = new Intersection({ x: 10, y: chance.integer({ min: 0, max: 99 }) });
          end = new Intersection({ x: 10, y: chance.integer({ min: 100, max: 500 }) });
          path = new Portal(start, end);
        });
  
        it('it properly configures the up path', () => {
          path.start = intersection;
  
          intersection.addPath(path);
          expect(intersection.paths.up).toMatchObject(path);
        });
  
        it('it properly configures the down path', () => {
          path.start = intersection;
  
          intersection.addPath(path);
          expect(intersection.paths.up).toMatchObject(path);
        });
      });
    });
  });

  describe('traverse()', () => {
    beforeEach(() => {
      intersection.paths = {
        left: chance.integer(),
        right: chance.integer(),
        down: chance.integer(),
        up: chance.integer()
      };
    });

    describe('given horizontal movement', () => {
      it('properly returns the left path', () => {
        const movement = { x: -1 };
        
        const value = intersection.traverse(movement);

        expect(value).toEqual(intersection.paths.left);
      });

      it('properly returns the right path', () => {
        const movement = { x: 1 };
        
        const value = intersection.traverse(movement);

        expect(value).toEqual(intersection.paths.right);
      });
    });

    describe('given vertical movement', () => {
      it('properly returns the up path', () => {
        const movement = { y: -1 };
        
        const value = intersection.traverse(movement);

        expect(value).toEqual(intersection.paths.up);
      });

      it('properly returns the down path', () => {
        const movement = { y: 1 };
        
        const value = intersection.traverse(movement);

        expect(value).toEqual(intersection.paths.down);
      });
    });
  });

  describe('getNeighbors()', () => {

    it('returns an empty array given there are no neighboring intersections', () => {
      expect(intersection.getNeighbors()).toHaveLength(0);
    });

    describe('given neighbors', () => {
      const neighbors = {};
      const paths = {};

      beforeEach(() => {
        neighbors.below = new Intersection({
          x: intersection.position.x,
          y: chance.integer({ min: intersection.position.y + 1 })
        });
        neighbors.left = new Intersection({
          x: chance.integer({ max: intersection.position.x - 1 }),
          y: intersection.position.y
        });

        paths.down = new Path(intersection, neighbors.below);
        paths.left = new Path(neighbors.left, intersection);
      });

      it('returns each of the neighbors correctly', () => {
        const result = intersection.getNeighbors();
        expect(result).toHaveLength(2);
        expect(result).toContainEqual(neighbors.below);
        expect(result).toContainEqual(neighbors.left);
      });
    });

    describe('given a neighbor connected via portal', () => {
      const neighbors = {};
      const paths = {};

      beforeEach(() => {
        neighbors.above = new Intersection({
          x: intersection.position.x,
          y: chance.integer({ max: intersection.position.y - 1 })
        });
        neighbors.right = new Intersection({
          x: chance.integer({ max: intersection.position.x + 1 }),
          y: intersection.position.y
        });

        paths.up = new Portal(neighbors.above, intersection);
        paths.right = new Portal(intersection, neighbors.right);
      });

      it('returns each of the neighbors correctly', () => {
        const result = intersection.getNeighbors();
        expect(result).toHaveLength(2);
        expect(result).toContainEqual(neighbors.above);
        expect(result).toContainEqual(neighbors.right);
      });
    });
  });

  describe('getPathToNeighbor()', () => {
    it('returns falsey given no neighbor is passed in', () => {
      expect(intersection.getPathToNeighbor()).not.toBeTruthy();
    });

    describe('given a neighbor is passed in', () => {
      const neighbors = {};
      const paths = {};

      beforeEach(() => {
        neighbors.below = new Intersection({
          x: intersection.position.x,
          y: chance.integer({ min: intersection.position.y + 1 })
        });
        neighbors.right = new Intersection({
          x: chance.integer({ min: intersection.position.x + 1 }),
          y: intersection.position.y
        });

        paths.down = new Path(intersection, neighbors.below);
        paths.left = new Portal(neighbors.right, intersection);
      });

      it('returns the path connecting the two intersections correctly', () => {
        expect(intersection.getPathToNeighbor(neighbors.below)).toMatchObject(paths.down);
      });

      it('returns the portal connecting the two intersections correctly', () => {
        expect(intersection.getPathToNeighbor(neighbors.right)).toMatchObject(paths.left);
      });
    });
  });
});
