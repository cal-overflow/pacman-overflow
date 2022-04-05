import { PowerPill } from '@/frontend/utilities/Items';
import Chance from 'chance';

const chance = new Chance();

describe('Item', () => {
  let pill, position;

  beforeEach(() => {
    position = {
      x: chance.integer(),
      y: chance.integer()
    };

    pill = new PowerPill(position);
  });

  it('creates a dot correctly', () => {
    expect(pill.position).toMatchObject(position);
    expect(pill.points).toEqual(0);
    expect(pill.lifespan).toBeUndefined();
    expect(pill.size).toEqual(12);
  });
});
