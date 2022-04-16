import Path from '@/frontend/utilities/Path.js';
import Intersection from '@/frontend/utilities/Intersection.js';
import Chance from 'chance';

const chance = new Chance();

describe('Path', () => {
  let path, start, end;

  describe('Given two horizontally aligned intersections', () => {
    beforeEach(() => {
      start = new Intersection({ x: chance.integer({ min: 0, max: 100 }), y: 10 });
      end = new Intersection({ x: chance.integer({ min: 0, max: 100 }), y: 10 });

      start.addPath = jest.fn();
      end.addPath = jest.fn();
  
      path = new Path(start, end);
    });
  
    it('creates a path correctly', () => {
      expect(path.isHorizontal).toBeTruthy();
      expect(path.isVertical).not.toBeTruthy();
      expect(path.isSafe).toBeTruthy();
      expect(path.start).toBe(start);
      expect(path.end).toBe(end);
      expect(path.isLair).not.toBeTruthy();
    });

    it('adds itself to both intersections list of paths', () => {
      expect(start.addPath).toBeCalled();
      expect(end.addPath).toBeCalled();

      expect(start.addPath).toBeCalledWith(path);
      expect(end.addPath).toBeCalledWith(path);
    });
  });

  describe('Given two vertically aligned intersections', () => {
    beforeEach(() => {
      start = new Intersection({ x: 10, y: chance.integer({ min: 0, max: 100 }) });
      end = new Intersection({ x: 10, y: chance.integer({ min: 0, max: 100 }) });

      start.addPath = jest.fn();
      end.addPath = jest.fn();
  
      path = new Path(start, end);
    });
  
    it('creates a path correctly', () => {
      expect(path.isHorizontal).not.toBeTruthy();
      expect(path.isVertical).toBeTruthy();
      expect(path.isSafe).toBeTruthy();
      expect(path.start).toBe(start);
      expect(path.end).toBe(end);
    });

    it('adds itself to both intersections list of paths', () => {
      expect(start.addPath).toBeCalled();
      expect(end.addPath).toBeCalled();

      expect(start.addPath).toBeCalledWith(path);
      expect(end.addPath).toBeCalledWith(path);
    });
  });

  describe('draw()', () => {
    describe('given the path is horizontal', () => {
      it.todo('correctly draws the path');
    });

    describe('given the path is vertical', () => {
      it.todo('correctly draws the path');
    });
  });
});
