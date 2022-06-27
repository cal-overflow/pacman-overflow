import { Dot, Fruit, PowerPill } from '@/backend/utilities/Items';
import Text from '@/backend/utilities/Text';
import { Blinky, Clyde, Inky, PacMan, Pinky } from '@/backend/utilities/Players';
import Chance from 'chance';

const chance = new Chance();

const generateFakePosition = () => ({
  x: chance.integer({ min: 0 }),
  y: chance.integer({ min: 0 })
});

const generateFakeItem = () => {
  const position = generateFakePosition();

  return chance.bool() ? new Fruit(position) : new Dot(position);
};

const generateFakePowerPill = () =>
  new PowerPill({
    position: generateFakePosition(),
  });

export const generateFakeItemsMixed = () => 
  chance.n(
    chance.bool() ? generateFakeItem : generateFakePowerPill,
    chance.integer({ min: 1, max: 100 })
  );

const generateFakePacMan = () => new PacMan();
const generateFakeBlinky = () => new Blinky();
const generateFakePinky = () => new Pinky();
const generateFakeInky = () => new Inky();
const generateFakeClyde = () => new Clyde();

export const generateFakePlayers = () => {
  const players = [
    generateFakePacMan(),
    generateFakeBlinky(),
    generateFakePinky(),
    generateFakeInky(),
    generateFakeClyde(),
  ];
  
  for (const player of players) {
    player.position = generateFakePosition();
  }

  return players;
};

export const generateFakeTextElements = () =>
  chance.n(generateFakeTextElement, chance.integer({ min: 1, max: 20 }));

const generateFakeTextElement = () =>
  new Text({
    position: generateFakePosition(),
    value: chance.string(),
    color: chance.color(),
    size: `${chance.integer({ min: 6, max: 50 })}px`
  });
