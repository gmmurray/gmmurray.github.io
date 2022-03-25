import { FireNumber, LevelTwoItem } from '../types/levelTwo';
import {
  ItemDefinition,
  LevelCast,
  PlayerCharacter,
} from '../types/interactions';

import { BASE_PLAYER_SPEED } from '../constants';
import { LevelTwo } from '../scenes/LevelTwo';
import { playerSpriteDefinition } from '../assetDefinitions/sprites';

const player: PlayerCharacter = {
  definition: playerSpriteDefinition,
  startingX: 40,
  startingY: 14,
  startingSpeed: BASE_PLAYER_SPEED,
};

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
    hint: '', // TODO:
  },
  {
    // small urn
    x: 36,
    y: 43,
    handler: params =>
      (params as LevelTwo).handlePillarOneItemInteraction('small urn'),
    friendlyName: 'small urn',
    pillar: 1,
    hint: '', // TODO:
  },
  {
    // bowl
    x: 39,
    y: 43,
    handler: params =>
      (params as LevelTwo).handlePillarOneItemInteraction('bowl'),
    friendlyName: 'bowl',
    pillar: 1,
    hint: '', // TODO:
  },
  {
    // crate
    x: 21,
    y: 23,
    handler: params =>
      (params as LevelTwo).handlePillarOneItemInteraction('crate'),
    friendlyName: 'crate',
    pillar: 1,
    hint: '', // TODO:
  },
  {
    // chest
    x: 5,
    y: 16,
    handler: params =>
      (params as LevelTwo).handlePillarOneItemInteraction('chest'),
    friendlyName: 'chest',
    pillar: 1,
    hint: '', // TODO:
  },
  {
    // large urn
    x: 1,
    y: 13,
    handler: params =>
      (params as LevelTwo).handlePillarOneItemInteraction('large urn'),
    friendlyName: 'large urn',
    pillar: 1,
    hint: '', // TODO:
  },
];

export const levelTwoCast: LevelCast = {
  player,
  npcs: [],
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
