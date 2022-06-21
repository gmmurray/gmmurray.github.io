import { AnimationDefinitionMap } from '../types/animations';
import { LayerDefinition } from '../types/assetDefinitions';

export const levelFourLayers: LayerDefinition = {
  ['ground']: {
    configure: (layer, level) => {
      layer.setCollisionByExclusion([-1]);
      level.physics.world.bounds.width = layer.width;
      level.physics.world.bounds.height = layer.height;
      level.physics.add.collider(layer, level.player);
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
};
