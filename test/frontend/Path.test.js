import Path from '@/frontend/Path.js';
import Chance from 'chance';

const chance = new Chance();

describe('Path', () => {
  let path, center, start, end;

  beforeEach(() => {
    center = chance.integer({ min: 50, max: 500 });
    start = chance.integer({ min: 0, max: 100 });
    end = chance.integer({ min: 101, max: 500 });

    path = new Path({
      horizontal: true,
      center,
      start,
      end
    });
  });

  it('creates a path with the correct default values', () => {
    expect(path.horizontal).toBeTruthy();
    expect(path.vertical).toBeUndefined();
    expect(path.center).toEqual(center);
    expect(path.start).toEqual(start);
    expect(path.end).toEqual(end);
    expect(path.length).toEqual(end - start);
  });
});
