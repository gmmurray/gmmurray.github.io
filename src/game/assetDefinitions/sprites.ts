import { SCALE } from '../constants';
import { SpriteDefinition } from '../types/assetDefinitions';
import { getSpriteSource } from '../helpers/getAssetSource';

export const gregSpriteDefinition: SpriteDefinition = {
  key: 'greg',
  source: getSpriteSource('greg_spritesheet'),
  frameWidth: 64,
  frameHeight: 64,
  walkingAnimationMapping: 0,
  scale: 2,
};

export const playerSpriteDefinition: SpriteDefinition = {
  key: 'player',
  source: getSpriteSource('player_spritesheet'),
  frameWidth: 32,
  frameHeight: 32,
  walkingAnimationMapping: 0,
  scale: SCALE,
};

export const greyCatSpriteDefinition: SpriteDefinition = {
  key: 'grey-cat',
  source: getSpriteSource('grey_cat_spritesheet'),
  frameWidth: 45,
  frameHeight: 68,
  walkingAnimationMapping: 0,
  scale: 1,
};

export const whiteCatSpriteDefinition: SpriteDefinition = {
  key: 'white-cat',
  source: getSpriteSource('white_cat_spritesheet'),
  frameWidth: 45,
  frameHeight: 68,
  walkingAnimationMapping: 0,
  scale: 1,
};
