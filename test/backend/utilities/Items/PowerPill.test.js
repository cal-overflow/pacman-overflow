import { PowerPill } from '@/backend/utilities/Items';
import { Player, PacMan } from '@/backend/utilities/Players';
import Chance from 'chance';

const chance = new Chance();

describe('PowerPill', () => {
  let pill, position;

  beforeEach(() => {
    position = {
      x: chance.integer(),
      y: chance.integer()
    };

    pill = new PowerPill(position);
  });

  it('creates a PowerPill correctly', () => {
    expect(pill.position).toMatchObject(position);
    expect(pill.type).toEqual('powerpill');
    expect(pill.points).toEqual(0);
    expect(pill.lifespan).toBeUndefined();
    expect(pill.size).toEqual(12);
    expect(pill.isFlashing).toBeTruthy();
  });

  describe('use()', () => {
    let player;

    describe('given the player is PacMan', () => {
      beforeEach(() => {
        player = new PacMan();
      });

      it('returns truthy', () => {
        const response = pill.use(player);
        expect(response).toBeTruthy();
      });
    });

    describe('given the player is not PacMan', () => {
      beforeEach(() => {
        player = new Player();
      });

      it('returns falsy', () => {
        const response = pill.use(player);
        expect(response).not.toBeTruthy();
      });
    });
  });
});
