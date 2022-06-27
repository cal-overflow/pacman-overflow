import Path from '@/backend/utilities/Path.js';
import Intersection from '@/backend/utilities/Intersection.js';
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

    it('correctly sets the path weight', () => {
      const expectedWeight = end.position.x - start.position.x;

      expect(path.weight).toEqual(expectedWeight);
    });

    it('adds itself to both intersections list of paths', () => {
      expect(start.addPath).toBeCalled();
      expect(end.addPath).toBeCalled();

      expect(start.addPath).toBeCalledWith(path);
      expect(end.addPath).toBeCalledWith(path);
    });

    describe('containsPosition()', () => {
      let mockPosition;
  
      beforeEach(() => {
        start = new Intersection({ x: chance.integer({ min: 0, max: 50 }), y: 10 });
        end = new Intersection({ x: chance.integer({ min: 51, max: 100 }), y: 10 });
  
        start.addPath = jest.fn();
        end.addPath = jest.fn();
    
        path = new Path(start, end);
      });
  
      it('returns falsey given no position is passed in', () => {
        expect(path.containsPosition()).not.toBeTruthy();
      });
  
  
      describe('given an item is passed in', () => {
        it('returns falsey given the position is not on the path', () => {
          mockPosition = {
            x: chance.integer({ min: start.position.x, max: end.position.x }),
            y: chance.integer({ min: end.position.y + 1})
          };
  
          expect(path.containsPosition(mockPosition)).not.toBeTruthy();
        });
  
        it('returns truthy given the position is on the path', () => {
          mockPosition = {
            x: chance.integer({ min: start.position.x, max: end.position.x }),
            y: 10
          };
  
          expect(path.containsPosition(mockPosition)).toBeTruthy();
        });
      });
    });
  });

  describe('Given two vertically aligned intersections', () => {
    beforeEach(() => {
      start = new Intersection({ x: 10, y: chance.integer({ min: 0, max: 50 }) });
      end = new Intersection({ x: 10, y: chance.integer({ min: 51, max: 100 }) });

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

    it('correctly sets the path weight', () => {
      const expectedWeight = end.position.y - start.position.y;

      expect(path.weight).toEqual(expectedWeight);
    });

    it('adds itself to both intersections list of paths', () => {
      expect(start.addPath).toBeCalled();
      expect(end.addPath).toBeCalled();

      expect(start.addPath).toBeCalledWith(path);
      expect(end.addPath).toBeCalledWith(path);
    });

    describe('containsPosition()', () => {
      let mockPosition;
  
      beforeEach(() => {
        start = new Intersection({ x: 10, y: chance.integer({ min: 0, max: 50 }) });
        end = new Intersection({ x: 10, y: chance.integer({ min: 51, max: 100 }) });
  
        start.addPath = jest.fn();
        end.addPath = jest.fn();
    
        path = new Path(start, end);
      });
  
      it('returns falsey given no position is passed in', () => {
        expect(path.containsPosition()).not.toBeTruthy();
      });
  
  
      describe('given an item is passed in', () => {
        it('returns falsey given the position is not on the path', () => {
          mockPosition = {
            x: chance.integer({ min: end.position.x + 1}),
            y: chance.integer({ min: start.position.y, max: end.position.y })
          };
  
          expect(path.containsPosition(mockPosition)).not.toBeTruthy();
        });
  
        it('returns truthy given the position is not on the path', () => {
          mockPosition = {
            x: 10,
            y: chance.integer({ min: start.position.y, max: end.position.y }),
          };
  
          expect(path.containsPosition(mockPosition)).toBeTruthy();
        });
      });
    });
  });
});
