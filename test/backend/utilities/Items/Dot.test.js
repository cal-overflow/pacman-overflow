import { Dot } from '@/backend/utilities/Items';
import { PacMan, Player } from '@/backend/utilities/Players';
import Chance from 'chance';

const chance = new Chance();

describe('Dot', () => {
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
    expect(dot.points).toEqual(5);
    expect(dot.type).toEqual('dot');
    expect(dot.lifespan).toBeUndefined();
    expect(dot.size).toEqual(5);
  });

  describe('use()', () => {
    let player;

    describe('given the player is PacMan', () => {
      beforeEach(() => {
        player = new PacMan();
      });

      it('returns truthy', () => {
        const response = dot.use(player);
        expect(response).toBeTruthy();
      });
      
      it('increments the player score', () => {
        dot.use(player);
        expect(player.score).toEqual(5);
      });
    });

    describe('given the player is not PacMan', () => {
      beforeEach(() => {
        player = new Player();
      });

      it('returns falsy', () => {
        const response = dot.use(player);
        expect(response).not.toBeTruthy();
      });
      
      it('does not increment the player score', () => {
        dot.use(player);
        expect(player.score).toEqual(0);
      });
    });
  });
});
