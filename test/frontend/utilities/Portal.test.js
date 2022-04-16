import { Player } from '@/frontend/utilities/Players';
import Portal from '@/frontend/utilities/Portal.js';
import Intersection from '@/frontend/utilities/Intersection.js';
import Chance from 'chance';

const chance = new Chance();

describe('Portal', () => {
  let portal, start, end;

  beforeEach(() => {
    start = new Intersection({ x: chance.integer({ min: 0, max: 100 }), y: 10 });
    end = new Intersection({ x: chance.integer({ min: 0, max: 100 }), y: 10 });


    start.addPath = jest.fn();
    end.addPath = jest.fn();

    portal = new Portal(start, end);
  });

  it('creates a portal correctly', () => {
    expect(portal.isHorizontal).toBeTruthy();
    expect(portal.isVertical).not.toBeTruthy();
    expect(portal.isSafe).toBeTruthy();
    expect(portal.start).toBe(start);
    expect(portal.end).toBe(end);
  });

  it('adds itself to both intersections list of paths', () => {
    expect(start.addPath).toBeCalled();
    expect(end.addPath).toBeCalled();

    expect(start.addPath).toBeCalledWith(portal);
    expect(end.addPath).toBeCalledWith(portal);
  });

  describe('travel()', () => {
    let player;

    beforeEach(() => {
      player = new Player();
      player.spawn(portal);
      player.teleport = jest.fn();

      portal.travel(player);
    });

    it('teleports the player', () => {
      expect(player.teleport).toBeCalled();
    });
  });
});
