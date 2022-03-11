import { SpriteDefinition } from '../types/assetDefinitions';
import { getSpriteSource } from '../helpers/getAssetSource';

export const gregSpriteDefinition: SpriteDefinition = {
  key: 'greg',
  source: getSpriteSource('greg_spritesheet'),
  frameWidth: 64,
  frameHeight: 64,
  walkingAnimationMapping: 0,
};

export const playerSpriteDefinition: SpriteDefinition = {
  key: 'player',
  source: getSpriteSource('player_spritesheet'),
  frameWidth: 32,
  frameHeight: 32,
  walkingAnimationMapping: 0,
};
