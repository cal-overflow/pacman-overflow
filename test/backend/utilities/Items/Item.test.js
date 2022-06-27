import { Item } from '@/backend/utilities/Items';
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
});
