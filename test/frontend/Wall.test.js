import Wall from '@/frontend/Wall.js';
import Chance from 'chance';

const chance = new Chance();

describe('Wall', () => {
  let wall, x, y, width, height;

  beforeEach(() => {
    x = chance.integer();
    y = chance.integer();
    width = chance.integer({ min: 1, max: 100 });
    height = chance.integer({ min: 1, max: 100 });
  });


  describe('default (solid wall)', () => {
    beforeEach(() => {
      wall = new Wall({
        x,
        y,
        width,
        height
      });
    });
    
    it('creates a wall with the correct values', () => {
      expect(wall.x).toEqual(x);
      expect(wall.y).toEqual(y);
      expect(wall.width).toEqual(width);
      expect(wall.height).toEqual(height);
      expect(wall.isHollow).toEqual(false);
    });
    
    describe('draw()', () => {
      let ctxMock;
    
      beforeEach(() => {
        ctxMock = {
          fillRect: jest.fn()
        };
    
        wall.draw(ctxMock);
      });
    
      it('calls the ctx rect() method correctly', () => {
        expect(ctxMock.fillRect).toBeCalled();
        expect(ctxMock.fillRect).toBeCalledWith(
          wall.x,
          wall.y,
          wall.width,
          wall.height
        );
      });
    });
  });

  describe('hollow wall', () => {
    beforeEach(() => {
      wall = new Wall({
        x,
        y,
        width,
        height,
        isHollow: true
      });
    });
    
    it('creates a wall with the correct values', () => {
      expect(wall.x).toEqual(x);
      expect(wall.y).toEqual(y);
      expect(wall.width).toEqual(width);
      expect(wall.height).toEqual(height);
      expect(wall.isHollow).toEqual(true);
    });
    
    describe('draw()', () => {
      let ctxMock;
    
      beforeEach(() => {
        ctxMock = {
          rect: jest.fn(),
          stroke: jest.fn()
        };
    
        wall.draw(ctxMock);
      });
    
      it('calls the ctx rect() method correctly', () => {
        expect(ctxMock.rect).toBeCalled();
        expect(ctxMock.rect).toBeCalledWith(
          wall.x,
          wall.y,
          wall.width,
          wall.height
        );
      });

      it('calls the ctx stroke() method', () => {
        expect(ctxMock.stroke).toBeCalled();
      });
    });
  });
});
