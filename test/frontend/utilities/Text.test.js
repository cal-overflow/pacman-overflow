import Text from '@/frontend/utilities/Text.js';
import Chance from 'chance';

const chance = new Chance();

describe('Text', () => {
  let text, position, value;

  beforeEach(() => {
    position = {
      x: chance.integer({ min: 0, max: 500 }),
      y: chance.integer({ min: 0, max: 500 })
    };

    value = chance.string();
    text = new Text({ position, value });
  });

  it('creates a text element correctly', () => {
    expect(text.position).toMatchObject(position);
    expect(text.value).toEqual(value);
    expect(text.color).toEqual('#808080');
    expect(text.size).toEqual('22px');
  });

  describe('constructing with a custom color and size', () => {
    let color, size;
    beforeEach(() => {
      color = chance.color({ format: 'hex' });
      size = `${chance.integer({ min: 0 })}px`;

      text = new Text({
        position,
        value,
        color,
        size
      });
    });
  
    it('creates a text element correctly', () => {
      expect(text.position).toMatchObject(position);
      expect(text.value).toEqual(value);
      expect(text.color).toEqual(color);
      expect(text.size).toEqual(size);
    });
  });
});
