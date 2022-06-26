import { Item } from '@/frontend/utilities/Items';
import Chance from 'chance';

const chance = new Chance();

describe('Item', () => {
  let item, position, points, size;

  beforeEach(() => {
    position = {
      x: chance.integer(),
      y: chance.integer()
    };
    points = chance.integer({ min: 0, max: 5000 });
    size = chance.integer({ min: 1, max: 20 });

    item = new Item({ position, points, size });
  });

  it('creates an item correctly', () => {
    expect(item.position).toMatchObject(position);
    expect(item.points).toEqual(points);
    expect(item.lifespan).toBeUndefined();
    expect(item.size).toEqual(size);
    expect(item.isFlashing).not.toBeTruthy();
  });

  describe('draw()', () => {
    let ctxMock;

    beforeEach(() => {
      item.position = {
        x: chance.integer(),
        y: chance.integer()
      };

      ctxMock = {
        beginPath: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
        stroke: jest.fn()
      };

      item.draw(ctxMock);
    });

    it('calls the ctx beginPath() method', () => {
      expect(ctxMock.beginPath).toBeCalled();
    });
    
    it('calls the ctx arc() method correctly', () => {
      expect(ctxMock.arc).toBeCalled();
      expect(ctxMock.arc).toBeCalledWith(
        item.position.x,
        item.position.y,
        item.size,
        0,
        2 * Math.PI
      );
    });

    it('calls the ctx fill() method', () => {
      expect(ctxMock.fill).toBeCalled();
    });
  });
});
