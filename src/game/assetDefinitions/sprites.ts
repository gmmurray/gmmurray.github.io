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
  key: `player-${source}`,
  source: getSpriteSource(`${source}_spritesheet`),
  frameWidth: 32,
  frameHeight: 32,
  walkingAnimationMapping: 0,
  scale: SCALE,
});

export const playerCharacterOptions: Record<string, SpriteDefinition> = {
  xion: createPlayerSpriteDefinition('xion'),
  irabel: createPlayerSpriteDefinition('irabel'),
  zaya: createPlayerSpriteDefinition('zaya'),
  orryn: createPlayerSpriteDefinition('orryn'),
  ['happy_cat']: createPlayerSpriteDefinition('happy_cat'),
  ['wizard_cat']: createPlayerSpriteDefinition('wizard_cat'),
};

export const gregSpriteDefinition: SpriteDefinition = {
  key: 'greg',
  source: getSpriteSource('greg_spritesheet'),
  frameWidth: 64,
  frameHeight: 64,
  walkingAnimationMapping: 0,
  scale: 2,
};

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

export const skeletonOneSpriteDefinition: SpriteDefinition = {
  key: 'skeleton-one',
  source: getSpriteSource('skeleton_one_spritesheet'),
  frameWidth: 32,
  frameHeight: 32,
  walkingAnimationMapping: 0,
  scale: SCALE,
};

export const skeletonTwoSpriteDefinition: SpriteDefinition = {
  key: 'skeleton-two',
  source: getSpriteSource('skeleton_two_spritesheet'),
  frameWidth: 32,
  frameHeight: 32,
  walkingAnimationMapping: 0,
  scale: SCALE,
};

export const goblinSpriteDefinition: SpriteDefinition = {
  key: 'goblin',
  source: getSpriteSource('goblin_spritesheet'),
  frameWidth: 32,
  frameHeight: 32,
  walkingAnimationMapping: 0,
  scale: SCALE,
};

export const soldierSpriteDefinition: SpriteDefinition = {
  key: 'soldier',
  source: getSpriteSource('soldier_spritesheet'),
  frameWidth: 32,
  frameHeight: 32,
  walkingAnimationMapping: 0,
  scale: SCALE,
};

export const beetleSpriteDefinition: SpriteDefinition = {
  key: 'beetle',
  source: getSpriteSource('beetle_spritesheet'),
  frameWidth: 32,
  frameHeight: 32,
  walkingAnimationMapping: 0,
  scale: SCALE,
};

export const acidBlobSpriteDefinition: SpriteDefinition = {
  key: 'acid-blob',
  source: getSpriteSource('acid_blob_spritesheet'),
  frameWidth: 32,
  frameHeight: 32,
  walkingAnimationMapping: 0,
  scale: SCALE,
};

export const slimeSpriteDefinition: SpriteDefinition = {
  key: 'slime',
  source: getSpriteSource('slime_spritesheet'),
  frameWidth: 32,
  frameHeight: 32,
  walkingAnimationMapping: 0,
  scale: SCALE,
};

export const purplePortalSpriteDefinition: SpriteDefinition = {
  key: 'purple-portal',
  source: getSpriteSource('purple_portal_spritesheet'),
  frameWidth: 64,
  frameHeight: 64,
  walkingAnimationMapping: 0,
  scale: SCALE,
};

export const fantasyIconsSpriteDefinition: SpriteDefinition = {
  key: 'fantasy-icons',
  source: getSpriteSource('fantasy_icons'),
  frameWidth: 32,
  frameHeight: 32,
  walkingAnimationMapping: 0,
  scale: 1,
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
