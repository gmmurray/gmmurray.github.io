import { LevelCast, PlayerCharacter } from '../types/interactions';

import { BASE_PLAYER_SPEED } from '../constants';
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
