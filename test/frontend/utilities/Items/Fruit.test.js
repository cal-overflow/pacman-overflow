import { Fruit } from '@/frontend/utilities/Items';
import Chance from 'chance';

const chance = new Chance();

describe('Fruit', () => {
  let fruit, position;

  beforeEach(() => {
    position = {
      x: chance.integer(),
      y: chance.integer()
    };

    fruit = new Fruit(position);
  });

  it('creates a fruit correctly', () => {
    expect(fruit.position).toMatchObject(position);
    expect(fruit.points).not.toEqual(0);
    expect(fruit.points % 50 == 0).toBeTruthy();
    expect(fruit.lifespan).toBeUndefined();
    expect(fruit.size).toEqual(16);
  });

  describe('use()', () => {

    it('returns truthy', () => {
      const response = fruit.use();
      expect(response).toBeTruthy();
    });
  });
});
