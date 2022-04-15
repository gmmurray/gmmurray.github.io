import {
  FireSpriteDefinition,
  SpriteDefinition,
} from '../types/assetDefinitions';

import { FireColor } from '../types/levelTwo';
import { LevelThreeDamagingFireDefinition } from '../types/levelThree';
import { SCALE } from '../constants';
import { getFireColorName } from '../helpers/fireColor';
import { getSpriteSource } from '../helpers/getAssetSource';

const createPlayerSpriteDefinition = (source: string): SpriteDefinition => ({
  key: 'player',
  source: getSpriteSource(`${source}_spritesheet`),
  frameWidth: 32,
  frameHeight: 32,
  walkingAnimationMapping: 0,
  scale: SCALE,
});

export const playerCharacterOptions: SpriteDefinition[] = [
  createPlayerSpriteDefinition('xion'),
  createPlayerSpriteDefinition('irabel'),
  createPlayerSpriteDefinition('zaya'),
  createPlayerSpriteDefinition('orryn'),
];

const randomCharacterNumber = Math.floor(Math.random() * 4);

export const gregSpriteDefinition: SpriteDefinition = {
  key: 'greg',
  source: getSpriteSource('greg_spritesheet'),
  frameWidth: 64,
  frameHeight: 64,
  walkingAnimationMapping: 0,
  scale: 2,
};

export const playerSpriteDefinition: SpriteDefinition =
  playerCharacterOptions[randomCharacterNumber];

export const greyCatSpriteDefinition: SpriteDefinition = {
  key: 'grey-cat',
  source: getSpriteSource('grey_cat_spritesheet'),
  frameWidth: 32,
  frameHeight: 32,
  walkingAnimationMapping: 0,
  scale: 2,
};

export const whiteCatSpriteDefinition: SpriteDefinition = {
  key: 'white-cat',
  source: getSpriteSource('white_cat_spritesheet'),
  frameWidth: 32,
  frameHeight: 32,
  walkingAnimationMapping: 0,
  scale: 2,
};

const createFireSprite = (color: FireColor): FireSpriteDefinition => ({
  key: `${getFireColorName(color)}-fire`,
  source: getSpriteSource(`${getFireColorName(color)}_fire_spritesheet`),
  frameWidth: 24,
  frameHeight: 32,
  scale: 3,
  color,
});

export const fireSpriteDefinitions: FireSpriteDefinition[] = [
  createFireSprite(FireColor.BLUE),
  createFireSprite(FireColor.GREEN),
  createFireSprite(FireColor.PURPLE),
  createFireSprite(FireColor.WHITE),
];

export const levelthreeFireColumnDefinition: LevelThreeDamagingFireDefinition = {
  key: 'level-three-fire-column',
  source: getSpriteSource('level_three_fire_column_spritesheet'),
  frameWidth: 45,
  frameHeight: 90,
  scale: 2,
  frameCount: 14,
  frameRate: 4,
};

export const levelThreeFireExplosionDefinition: LevelThreeDamagingFireDefinition = {
  key: 'level-three-fire-explosion',
  source: getSpriteSource('level_three_fire_explosion_spritesheet'),
  frameWidth: 32,
  frameHeight: 32,
  scale: 2,
  frameCount: 4,
  frameRate: 3,
};

export const levelThreeFireBarrierDefinition = {
  key: 'level-three-fire-barrier',
  source: getSpriteSource('orange_fire_spritesheet'),
  frameWidth: 20,
  frameHeight: 24,
  scale: 3,
  frameCount: 8,
  frameRate: 4,
  offsetY: -20,
};
