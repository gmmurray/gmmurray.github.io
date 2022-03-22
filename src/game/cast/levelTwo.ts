import { LevelCast, PlayerCharacter } from '../types/interactions';

import { BASE_PLAYER_SPEED } from '../constants';
import { FireNumber } from '../types/levelTwo';
import { playerSpriteDefinition } from '../assetDefinitions/sprites';

const player: PlayerCharacter = {
  definition: playerSpriteDefinition,
  startingX: 23,
  startingY: 28,
  startingSpeed: BASE_PLAYER_SPEED,
};

export const levelTwoCast: LevelCast = {
  player,
  npcs: [],
  items: [],
  portals: [],
  doors: [],
};

export const fireStartLocations = {
  [FireNumber.ONE]: {
    x: 23,
    y: 30,
  },
  [FireNumber.TWO]: {
    x: 23,
    y: 32,
  },
  [FireNumber.THREE]: {
    x: 23,
    y: 34,
  },
  [FireNumber.FOUR]: {
    x: 23,
    y: 36,
  },
};
