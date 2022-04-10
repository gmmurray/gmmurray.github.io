import { FireNumber, LevelTwoItem, PillarTwoSolution } from '../types/levelTwo';
import {
  ItemDefinition,
  LevelCast,
  NpcCharacter,
  PlayerCharacter,
} from '../types/interactions';
import {
  gregSpriteDefinition,
  playerSpriteDefinition,
} from '../assetDefinitions/sprites';

import { BASE_PLAYER_SPEED } from '../constants';
import { LevelTwo } from '../scenes/LevelTwo';

const player: PlayerCharacter = {
  definition: playerSpriteDefinition,
  startingX: 10,
  startingY: 18,
  startingSpeed: BASE_PLAYER_SPEED,
};

const npcs: NpcCharacter[] = [
  {
    definition: gregSpriteDefinition,
    startingX: 20,
    startingY: 12,
    startingSpeed: 2,
    friendlyName: 'Greg',
    handler: params => (params as LevelTwo).handleGregInteraction(),
  },
];

const items: LevelTwoItem[] = [
  {
    // angel
    x: 24,
    y: 27,
    handler: params => (params as LevelTwo).handleAngelInteraction(),
    friendlyName: 'guide',
  },
  {
    x: 40,
    y: 10,
    handler: params => (params as LevelTwo).showNextFire(FireNumber.ONE),
    friendlyName: 'first fire',
    pillar: 3,
  },
  {
    x: 43,
    y: 13,
    handler: params => (params as LevelTwo).showNextFire(FireNumber.TWO),
    friendlyName: 'second fire',
    pillar: 3,
  },
  {
    x: 40,
    y: 16,
    handler: params => (params as LevelTwo).showNextFire(FireNumber.THREE),
    friendlyName: 'third fire',
    pillar: 3,
  },
  {
    x: 37,
    y: 13,
    handler: params => (params as LevelTwo).showNextFire(FireNumber.FOUR),
    friendlyName: 'fourth fire',
    pillar: 3,
  },
  {
    // pillar 3
    x: 37,
    y: 30,
    handler: params => (params as LevelTwo).handlePillarThreeInteraction(),
    friendlyName: 'pillar of matching',
  },
  {
    // pillar 1
    x: 2,
    y: 41,
    handler: params => (params as LevelTwo).handlePillarOneInteraction(),
    friendlyName: 'monolith to exploration',
  },
  {
    // pillar 2
    x: 7,
    y: 10,
    handler: params => (params as LevelTwo).handlePillarTwoInteraction(),
    friendlyName: 'column of choice',
  },
  {
    // barrel
    x: 2,
    y: 30,
    handler: params =>
      (params as LevelTwo).handlePillarOneItemInteraction('barrel'),
    friendlyName: 'barrel',
    pillar: 1,
    hint: `don't confuse me for a keg`,
  },
  {
    // small urn
    x: 36,
    y: 43,
    handler: params =>
      (params as LevelTwo).handlePillarOneItemInteraction('small urn'),
    friendlyName: 'small urn',
    pillar: 1,
    hint: `I may remind you of a vase but just know that I am small`,
  },
  {
    // bowl
    x: 39,
    y: 43,
    handler: params =>
      (params as LevelTwo).handlePillarOneItemInteraction('bowl'),
    friendlyName: 'bowl',
    pillar: 1,
    hint: `do you put milk or cereal first?`,
  },
  {
    // crate
    x: 21,
    y: 23,
    handler: params =>
      (params as LevelTwo).handlePillarOneItemInteraction('crate'),
    friendlyName: 'crate',
    pillar: 1,
    hint: `you can use me to transport all of your stuff`,
  },
  {
    // chest
    x: 5,
    y: 16,
    handler: params =>
      (params as LevelTwo).handlePillarOneItemInteraction('chest'),
    friendlyName: 'chest',
    pillar: 1,
    hint: `pirates are currently looking for me`,
  },
  {
    // large urn
    x: 1,
    y: 13,
    handler: params =>
      (params as LevelTwo).handlePillarOneItemInteraction('large urn'),
    friendlyName: 'large urn',
    pillar: 1,
    hint: 'I may remind you of a vase but just know that I am large',
  },
];

export const levelTwoCast: LevelCast = {
  player,
  npcs,
  items,
  portals: [],
  doors: [],
};

export const fireStartLocations = {
  [FireNumber.ONE]: {
    x: 40,
    y: 10,
  },
  [FireNumber.TWO]: {
    x: 43,
    y: 13,
  },
  [FireNumber.THREE]: {
    x: 40,
    y: 16,
  },
  [FireNumber.FOUR]: {
    x: 37,
    y: 13,
  },
};

export const pillarTwoSolutions: PillarTwoSolution[] = [
  {
    question: `Here's your question: what is Greg's favorite animal?`,
    options: [
      {
        id: 1,
        text: 'Baluga whale',
      },
      {
        id: 2,
        text: 'Poison dart frog',
      },
      {
        id: 3,
        text: 'Siamese cat',
      },
      {
        id: 4,
        text: 'Cardigan welsh corgi',
      },
    ],
    answer: 2,
    hint: `Frogs...why'd it have to be frogs?!`,
  },
  {
    question: `Get to the bottom of this: on a warm summer day, what is Greg's favorite drink?`,
    options: [
      {
        id: 1,
        text: 'Coca-Cola',
      },
      {
        id: 2,
        text: `Barq's Root Beer`,
      },
      {
        id: 3,
        text: 'Orange Crush',
      },
      {
        id: 4,
        text: 'Spring Water',
      },
    ],
    answer: 2,
    hint: `Let's just get to the root of the problem.`,
  },
  {
    question: `Can you solve this? What is Greg's favorite fantasy/fiction world?`,
    options: [
      {
        id: 1,
        text: 'Lord of the Rings',
      },
      {
        id: 2,
        text: `Star Wars`,
      },
      {
        id: 3,
        text: 'Star Trek',
      },
      {
        id: 4,
        text: 'Harry Potter',
      },
    ],
    answer: 2,
    hint: `I can't talk right now, I'm listening to Duel of the Fates.`,
  },
  {
    question: `Something simple for you. What is Greg's favorite Marvel character`,
    options: [
      {
        id: 1,
        text: 'Thor',
      },
      {
        id: 2,
        text: `Thanos`,
      },
      {
        id: 3,
        text: 'Spider Man',
      },
      {
        id: 4,
        text: 'Black Panther',
      },
    ],
    answer: 4,
    hint: `Has anyone seen any vibranium lately? I need to find some.`,
  },
];
