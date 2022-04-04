import Intersection from '@/frontend/utilities/Intersection.js';
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
    expect(intersection.position).toMatchObject(position);
    expect(intersection.paths).toMatchObject({});
  });

  describe('addPath()', () => {
    let path;
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

  describe('draw()', () => {
    describe('given the intersection joins two paths', () => {
      it.todo('correctly draws the intersection');
    });

    describe('given the intersection joins three paths', () => {
      it.todo('correctly draws the intersection');
    });

    describe('given the intersection joins four paths', () => {
      it.todo('correctly draws the intersection');
    });
  });
});
