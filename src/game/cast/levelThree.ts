import { BASE_PLAYER_SPEED, LEVEL_ONE_SCENE_KEY } from '../constants';
import {
  DoorDefinition,
  LevelCast,
  NpcCharacter,
  PlayerCharacter,
  PortalDefinition,
  PortalType,
} from '../types/interactions';
import {
  LevelThreeDifficulty,
  LevelThreeDifficultySettingsMap,
  LevelThreeItem,
  OrbMap,
  PotionType,
} from '../types/levelThree';

import { Coordinates } from '../types/position';
import { Direction } from 'grid-engine';
import { LevelThree } from '../scenes/LevelThree';
import { playerSpriteDefinition } from '../assetDefinitions/sprites';

export const orbMap: OrbMap = {
  1: {
    location: {
      primary: {
        x: 5,
        y: 10,
      },
      all: [
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
      ],
    },
  },
  2: {
    location: {
      primary: {
        x: 86,
        y: 16,
      },
      all: [
        {
          x: 85,
          y: 16,
        },
        {
          x: 86,
          y: 16,
        },
        {
          x: 87,
          y: 16,
        },
        {
          x: 85,
          y: 17,
        },
        {
          x: 86,
          y: 17,
        },
        {
          x: 87,
          y: 17,
        },
      ],
    },
  },
  3: {
    location: {
      primary: {
        x: 65,
        y: 32,
      },
      all: [
        {
          x: 64,
          y: 32,
        },
        {
          x: 65,
          y: 32,
        },
        {
          x: 66,
          y: 32,
        },
        {
          x: 64,
          y: 33,
        },
        {
          x: 65,
          y: 33,
        },
        {
          x: 66,
          y: 33,
        },
      ],
    },
  },
};

const player: PlayerCharacter = {
  definition: playerSpriteDefinition,
  startingX: 4,
  startingY: 47,
  startingSpeed: BASE_PLAYER_SPEED,
};

const npcs: NpcCharacter[] = [];

const items: LevelThreeItem[] = [
  {
    // p1 health mini 1
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
    // p1 health mini 2
    x: 24,
    y: 19,
    handler: params =>
      (params as LevelThree).handlePotionConsume(PotionType.MINI_HEALTH, {
        x: 24,
        y: 19,
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
    // p2 normal health
    x: 94,
    y: 9,
    handler: params =>
      (params as LevelThree).handlePotionConsume(PotionType.HEALTH, {
        x: 94,
        y: 9,
      }),
    friendlyName: 'big health potion',
  },
  {
    // p2 mini health (hidden)
    x: 81,
    y: 12,
    handler: params =>
      (params as LevelThree).handlePotionConsume(PotionType.MINI_HEALTH, {
        x: 81,
        y: 12,
      }),
    friendlyName: 'hidden mini health potion',
  },
  {
    // p2 mini health
    x: 80,
    y: 31,
    handler: params =>
      (params as LevelThree).handlePotionConsume(PotionType.MINI_HEALTH, {
        x: 80,
        y: 31,
      }),
    friendlyName: 'mini health potion',
  },
  {
    // p2 speed potion
    x: 80,
    y: 23,
    handler: params =>
      (params as LevelThree).handlePotionConsume(PotionType.SPEED, {
        x: 80,
        y: 23,
      }),
    friendlyName: 'speed potion',
  },
  {
    // p3 mini health 1
    x: 50,
    y: 77,
    handler: params =>
      (params as LevelThree).handlePotionConsume(PotionType.MINI_HEALTH, {
        x: 50,
        y: 77,
      }),
    friendlyName: 'mini health potion',
  },
  {
    // p3 mini health 2
    x: 43,
    y: 82,
    handler: params =>
      (params as LevelThree).handlePotionConsume(PotionType.MINI_HEALTH, {
        x: 43,
        y: 82,
      }),
    friendlyName: 'mini health potion',
  },
  {
    // orb 1
    x: orbMap[1].location.primary.x,
    y: orbMap[1].location.primary.y,
    handler: params => (params as LevelThree).handleOrbCollection(1),
    friendlyName: 'first orb',
  },
  {
    // orb 2
    x: orbMap[2].location.primary.x,
    y: orbMap[2].location.primary.y,
    handler: params => (params as LevelThree).handleOrbCollection(2),
    friendlyName: 'second orb',
  },
  {
    // orb 3
    x: orbMap[3].location.primary.x,
    y: orbMap[3].location.primary.y,
    handler: params => (params as LevelThree).handleOrbCollection(3),
    friendlyName: 'third orb',
  },
];

const portals: PortalDefinition[] = [
  {
    from: {
      x: 48,
      y: 89,
    },
    type: PortalType.SCENE,
    to: LEVEL_ONE_SCENE_KEY,
    dialog: 'the portal hums with magical energy as you approach...',
    friendlyName: 'back to beginning',
  },
];

const doors: DoorDefinition[] = [
  {
    // p1 to go downstairs
    from: [
      {
        x: 38,
        y: 29,
      },
      {
        x: 38,
        y: 30,
      },
    ],
    to: { x: 53, y: 9 },
    friendlyName: 'descend',
    face: Direction.DOWN,
    layer: 'ground',
    inactive: true,
    inactiveDialog: 'you must gather this floors orbs before descending',
    inactiveMoveDir: Direction.RIGHT,
  },
  {
    // p2 to go downstairs
    from: [
      {
        x: 59,
        y: 43,
      },
      {
        x: 60,
        y: 43,
      },
      {
        x: 61,
        y: 43,
      },
    ],
    to: { x: 47, y: 63 },
    friendlyName: 'descend',
    face: Direction.DOWN,
    layer: 'ground',
    inactive: true,
    inactiveDialog: 'you must gather this floors orbs before descending',
    inactiveMoveDir: Direction.DOWN,
  },
  {
    // p2 to go upstairs
    from: [
      {
        x: 53,
        y: 6,
      },
      {
        x: 54,
        y: 6,
      },
    ],
    to: {
      x: 39,
      y: 31,
    },
    friendlyName: 'ascend',
    face: Direction.DOWN,
    layer: 'ground',
  },
  {
    // p3 to go upstairs
    from: [
      {
        x: 46,
        y: 60,
      },
      {
        x: 47,
        y: 60,
      },
      {
        x: 48,
        y: 60,
      },
    ],
    to: {
      x: 60,
      y: 46,
    },
    friendlyName: 'ascend',
    face: Direction.DOWN,
    layer: 'ground',
  },
];

export const levelThreeCast: LevelCast = {
  player,
  npcs,
  items,
  portals,
  doors,
};

export const levelThreeDifficultySettingsMap: LevelThreeDifficultySettingsMap = {
  [LevelThreeDifficulty.EASY]: {
    healthPotions: {
      mini: 10,
      normal: 50,
    },
    player: {
      speedMod: 1.5,
      speedDuration: 5000,
    },
    enemy: {
      damageMod: 1,
      critsEnabled: false,
      speedMod: 1,
      followEnabled: false,
    },
    fire: {
      speedModifier: 1,
      damageModifier: 1,
    },
  },
  [LevelThreeDifficulty.NORMAL]: {
    healthPotions: {
      mini: 20,
      normal: 50,
    },
    player: {
      speedMod: 1.5,
      speedDuration: 6000,
    },
    enemy: {
      damageMod: 2,
      critsEnabled: false,
      speedMod: 1,
      followEnabled: false,
    },
    fire: {
      speedModifier: 0.8,
      damageModifier: 1.5,
    },
  },
  [LevelThreeDifficulty.HEROIC]: {
    healthPotions: {
      mini: 20,
      normal: 50,
    },
    player: {
      speedMod: 1.5,
      speedDuration: 7000,
    },
    enemy: {
      damageMod: 2,
      critsEnabled: true,
      speedMod: 1,
      followEnabled: false,
    },
    fire: {
      speedModifier: 0.6,
      damageModifier: 2,
    },
  },
  [LevelThreeDifficulty.LEGENDARY]: {
    healthPotions: {
      mini: 20,
      normal: 50,
    },
    player: {
      speedMod: 1.5,
      speedDuration: 8000,
    },
    enemy: {
      damageMod: 2,
      critsEnabled: true,
      speedMod: 2,
      followEnabled: false,
    },
    fire: {
      speedModifier: 0.5,
      damageModifier: 3,
    },
  },
  [LevelThreeDifficulty.NIGHTMARE]: {
    healthPotions: {
      mini: 20,
      normal: 50,
    },
    player: {
      speedMod: 1.5,
      speedDuration: 10000,
    },
    enemy: {
      damageMod: 2,
      critsEnabled: true,
      speedMod: 2,
      followEnabled: true,
    },
    fire: {
      speedModifier: 0.4,
      damageModifier: 4,
    },
  },
};

export const levelThreeFireColumnLocations: Coordinates[] = [
  {
    x: 46,
    y: 78,
  },
  {
    x: 46,
    y: 79,
  },
  {
    x: 46,
    y: 80,
  },
  { x: 49, y: 75 },
  { x: 50, y: 75 },
  { x: 51, y: 75 },
  { x: 44, y: 82 },
  { x: 44, y: 83 },
  { x: 48, y: 85 },
  { x: 48, y: 86 },
  { x: 52, y: 85 },
  { x: 52, y: 86 },
  { x: 52, y: 88 },
  { x: 52, y: 89 },
  { x: 51, y: 88 },
  { x: 51, y: 89 },
];

export const levelThreeFireExplosionLocations: Coordinates[] = [
  {
    x: 43,
    y: 78,
  },
  {
    x: 43,
    y: 79,
  },
  {
    x: 43,
    y: 80,
  },
  {
    x: 50,
    y: 85,
  },
  {
    x: 50,
    y: 86,
  },
];

export const levelThreeFireBarrierLocations: Coordinates[] = [
  {
    x: 40,
    y: 77,
  },
  {
    x: 41,
    y: 77,
  },
  {
    x: 48,
    y: 77,
  },
  {
    x: 48,
    y: 76,
  },
  {
    x: 48,
    y: 75,
  },
  {
    x: 49,
    y: 74,
  },
  {
    x: 49,
    y: 73,
  },
  {
    x: 50,
    y: 73,
  },
  {
    x: 50,
    y: 72,
  },
  {
    x: 51,
    y: 72,
  },
  {
    x: 52,
    y: 72,
  },
  {
    x: 52,
    y: 73,
  },
  {
    x: 52,
    y: 75,
  },
  {
    x: 52,
    y: 76,
  },
  {
    x: 52,
    y: 77,
  },
  {
    x: 51,
    y: 84,
  },
  {
    x: 50,
    y: 84,
  },
  {
    x: 49,
    y: 84,
  },
  {
    x: 48,
    y: 84,
  },
  {
    x: 48,
    y: 83,
  },
  {
    x: 47,
    y: 82,
  },
  {
    x: 46,
    y: 81,
  },
  {
    x: 45,
    y: 81,
  },
  {
    x: 44,
    y: 81,
  },
  {
    x: 43,
    y: 81,
  },
  {
    x: 42,
    y: 81,
  },
  {
    x: 42,
    y: 82,
  },
  {
    x: 42,
    y: 83,
  },
  {
    x: 52,
    y: 87,
  },
  {
    x: 51,
    y: 87,
  },
  {
    x: 50,
    y: 87,
  },
  {
    x: 49,
    y: 87,
  },
  {
    x: 48,
    y: 87,
  },
  {
    x: 47,
    y: 87,
  },
  {
    x: 47,
    y: 88,
  },
  {
    x: 47,
    y: 89,
  },
];
