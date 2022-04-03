import Hall from '@/frontend/Hall.js';
import Chance from 'chance';

const chance = new Chance();

describe('Hall', () => {
  let hall, center, start, end;

  beforeEach(() => {
    center = chance.integer({ min: 50, max: 500 });
    start = chance.integer({ min: 0, max: 100 });
    end = chance.integer({ min: 101, max: 500 });
  });

  describe('horizontal hall', () => {
    beforeEach(() => {
      hall = new Hall({
        horizontal: true,
        center,
        start,
        end
      });
    });

    it('creates a hall path with the correct default values', () => {
      expect(hall.horizontal).toBeTruthy();
      expect(hall.vertical).toBeUndefined();
      expect(hall.center).toEqual(center);
      expect(hall.start).toEqual(start);
      expect(hall.end).toEqual(end);
      expect(hall.length).toEqual(hall.end - hall.start);
    });
  
    describe('draw()', () => {
      let ctxMock;
  
      beforeEach(() => {
        ctxMock = {
          fillRect: jest.fn()
        };
  
        hall.draw(ctxMock);
      });
  
      it('calls the ctx fillRect() method correctly', () => {
        expect(ctxMock.fillRect).toBeCalledTimes(2);
        expect(ctxMock.fillRect).toBeCalledWith(start, center - 20, hall.length, hall.wallThickness);
        expect(ctxMock.fillRect).toBeCalledWith(start, center + 20 - hall.wallThickness , hall.length, hall.wallThickness);
      });
    });
  });

  describe('vertical hall', () => {
    beforeEach(() => {
      hall = new Hall({
        vertical: true,
        center,
        start,
        end
      });
    });

    it('creates a hall path with the correct default values', () => {
      expect(hall.horizontal).toBeUndefined();
      expect(hall.vertical).toBeTruthy();
      expect(hall.center).toEqual(center);
      expect(hall.start).toEqual(start);
      expect(hall.end).toEqual(end);
      expect(hall.length).toEqual(hall.end - hall.start);
    });
  
    describe('draw()', () => {
      let ctxMock;
  
      beforeEach(() => {
        ctxMock = {
          fillRect: jest.fn()
        };
  
        hall.draw(ctxMock);
      });
  
      it('calls the ctx fillRect() method correctly', () => {
        expect(ctxMock.fillRect).toBeCalledTimes(2);
        expect(ctxMock.fillRect).toBeCalledWith(center - 20, start, hall.wallThickness, hall.length);
        expect(ctxMock.fillRect).toBeCalledWith(center + 20 - hall.wallThickness, start, hall.wallThickness, hall.length);
      });
    });
  });
});
