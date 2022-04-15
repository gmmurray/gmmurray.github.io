import {
  DoorDefinition,
  ItemDefinition,
  LevelCast,
  NpcCharacter,
  PlayerCharacter,
  PortalDefinition,
} from '../types/interactions';
import {
  LevelThreeDifficulty,
  LevelThreeDifficultySettingsMap,
  LevelThreeItem,
  LevelThreeState,
  OrbMap,
  PotionType,
} from '../types/levelThree';

import { BASE_PLAYER_SPEED } from '../constants';
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
  startingY: 48,
  // startingX: 53,
  // startingY: 9,
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

const portals: PortalDefinition[] = [];

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
    x: 3,
    y: 44,
  },
  {
    x: 4,
    y: 44,
  },
  {
    x: 5,
    y: 44,
  },
  {
    x: 6,
    y: 44,
  },
];

export const levelThreeFireExplosionLocations: Coordinates[] = [
  {
    x: 4,
    y: 46,
  },
];

export const levelThreeInitialState: LevelThreeState = {
  orbs: {
    1: false,
    2: false,
    3: false,
  },
  health: 100,
  difficultySettings: {
    ...levelThreeDifficultySettingsMap[LevelThreeDifficulty.EASY],
  },
  standingInFire: false,
  fireIsActive: false,
  steppedOnFire: undefined,
};
