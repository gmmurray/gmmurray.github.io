import { SCALE } from '../constants';
import { SpriteDefinition } from '../types/assetDefinitions';
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
