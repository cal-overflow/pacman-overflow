import { Dot } from '@/frontend/utilities/Items';
import Chance from 'chance';

const chance = new Chance();

describe('Item', () => {
  let dot, position;

  beforeEach(() => {
    position = {
      x: chance.integer(),
      y: chance.integer()
    };

    dot = new Dot(position);
  });

  it('creates a dot correctly', () => {
    expect(dot.position).toMatchObject(position);
    expect(dot.points).toEqual(1);
    expect(dot.lifespan).toBeUndefined();
    expect(dot.size).toEqual(5);
  });
});
