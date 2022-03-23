import {
  ItemDefinition,
  LevelCast,
  PlayerCharacter,
} from '../types/interactions';

import { BASE_PLAYER_SPEED } from '../constants';
import { FireNumber } from '../types/levelTwo';
import { LevelTwo } from '../scenes/LevelTwo';
import { playerSpriteDefinition } from '../assetDefinitions/sprites';

const player: PlayerCharacter = {
  definition: playerSpriteDefinition,
  startingX: 40,
  startingY: 14,
  startingSpeed: BASE_PLAYER_SPEED,
};

const items: ItemDefinition[] = [
  {
    x: 40,
    y: 10,
    handler: params => (params as LevelTwo).showNextFire(FireNumber.ONE),
    friendlyName: 'first fire',
  },
  {
    x: 43,
    y: 13,
    handler: params => (params as LevelTwo).showNextFire(FireNumber.TWO),
    friendlyName: 'second fire',
  },
  {
    x: 40,
    y: 16,
    handler: params => (params as LevelTwo).showNextFire(FireNumber.THREE),
    friendlyName: 'third fire',
  },
  {
    x: 37,
    y: 13,
    handler: params => (params as LevelTwo).showNextFire(FireNumber.FOUR),
    friendlyName: 'fourth fire',
  },
  {
    x: 37, // pillar 3
    y: 30,
    handler: params => (params as LevelTwo).handlePillarThreeInteraction(),
    friendlyName: 'pillar of matching',
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
