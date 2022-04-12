import {
  DoorDefinition,
  ItemDefinition,
  LevelCast,
  NpcCharacter,
  PlayerCharacter,
  PortalDefinition,
} from '../types/interactions';
import { LevelThreeItem, PotionType } from '../types/levelThree';

import { BASE_PLAYER_SPEED } from '../constants';
import { Coordinates } from '../types/position';
import { LevelThree } from '../scenes/LevelThree';
import { playerSpriteDefinition } from '../assetDefinitions/sprites';

const orbOneTiles: Coordinates[] = [
  {
    x: 4,
    y: 10,
  },
  {
    x: 5,
    y: 10,
  },
  {
    x: 6,
    y: 10,
  },
  {
    x: 4,
    y: 11,
  },
  {
    x: 5,
    y: 11,
  },
  {
    x: 6,
    y: 11,
  },
];

const player: PlayerCharacter = {
  definition: playerSpriteDefinition,
  startingX: 4,
  startingY: 48,
  startingSpeed: BASE_PLAYER_SPEED,
};

const npcs: NpcCharacter[] = [];

const items: LevelThreeItem[] = [
  {
    // p1 health mini
    x: 20,
    y: 47,
    handler: params =>
      (params as LevelThree).handlePotionConsume(PotionType.MINI_HEALTH, {
        x: 20,
        y: 47,
      }),
    friendlyName: 'mini health potion',
  },
  {
    // p1 speed potion
    x: 7,
    y: 8,
    handler: params =>
      (params as LevelThree).handlePotionConsume(PotionType.SPEED, {
        x: 7,
        y: 8,
      }),
    friendlyName: 'speed potion',
  },
  {
    // orb 1
    x: orbOneTiles[1].x,
    y: orbOneTiles[1].y,
    handler: params =>
      (params as LevelThree).handleOrbCollection(
        { x: orbOneTiles[1].x, y: orbOneTiles[1].y },
        orbOneTiles,
      ),
    friendlyName: 'first orb',
  },
];

const portals: PortalDefinition[] = [];

const doors: DoorDefinition[] = [];

export const levelThreeCast: LevelCast = {
  player,
  npcs,
  items,
  portals,
  doors,
};
