import { AnimationDefinitionMap } from '../types/animations';
import { LayerDefinition } from '../types/assetDefinitions';
import { LevelFourEnemyDefinition } from '../types/levelFour';

export const levelFourLayers: LayerDefinition = {
  ['ground']: {
    configure: (layer, level) => {
      layer.setCollisionByExclusion([-1]);
      level.physics.world.bounds.width = layer.width;
      level.physics.world.bounds.height = layer.height;
      level.physics.add.collider(layer, level.player);
      Object.keys(level.enemies).forEach(key => {
        if (level.enemies[key] && level.enemies[key].sprite) {
          level.physics.add.collider(layer, level.enemies[key].sprite);
        }
      });
    },
  },
  ['lava']: {
    configure: (layer, level) => {
      layer.setCollisionByExclusion([-1]);
      level.physics.add.collider(
        layer,
        level.player,
        level.handleLavaCollision,
        undefined,
        this,
      );
    },
  },
  ['bg_parallax_upper']: {
    depth: 5,
  },
  ['bg_parallax_lower']: {
    depth: 5,
  },
  ['bg_static']: {
    depth: 5,
  },
  ['water']: {
    depth: 16,
  },
};

export const levelFourAnimations: AnimationDefinitionMap = {
  player: {
    walk: {
      key: 'walk',
      frames: [6, 7, 8],
      frameRate: 6,
      repeat: -1,
    },
    idle: {
      key: 'idle',
      frames: [7],
    },
  },
};

export const levelFourEnemies: LevelFourEnemyDefinition[] = [
  {
    id: 'enemy-1',
    textureKey: 'soldier',
    startPos: {
      x: 3,
      y: 34,
    },
    bounds: {
      left: 3,
      right: 5,
    },
    damage: 10,
  },
];
