import { Fruit } from '@/backend/utilities/Items';
import { PacMan, Ghost, Player } from '@/backend/utilities/Players';
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
    expect(fruit.type).toEqual('fruit');
    expect(fruit.points).not.toEqual(0);
    expect(fruit.points % 50 == 0).toBeTruthy();
    expect(fruit.lifespan).toBeUndefined();
    expect(fruit.size).toEqual(16);
  });

  describe('use()', () => {
    let player, initalPointsValue;
    
    it('returns truthy', () => {
      const response = fruit.use(new Player());
      expect(response).toBeTruthy();
    });

    describe('given the player is PacMan', () => {
      beforeEach(() => {
        initalPointsValue = fruit.points;
        player = new PacMan();
        fruit.use(player);
      });
      
      it('increments the player score', () => {
        expect(player.score).toEqual(fruit.points);
      });
    });

    describe('given the player is a Ghost', () => {
      beforeEach(() => {
        initalPointsValue = fruit.points;
        player = new Ghost();
      });

      it('doubles the point value and increments the players score', () => {
        fruit.use(player);
        expect(fruit.points).toEqual(initalPointsValue * 2);
        expect(player.score).toEqual(fruit.points);
      });

      describe('given the player is scared', () => {
        beforeEach(() => {
          player.isScared = true;
        });
        
        it('quadruples the point value and increments the players score', () => {
          fruit.use(player);
          expect(fruit.points).toEqual(initalPointsValue * 4);
          expect(player.score).toEqual(fruit.points);
        });
      });
    });
  });
});
