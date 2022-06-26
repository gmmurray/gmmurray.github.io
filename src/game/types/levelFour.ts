import { AnimationDefinitionMap } from './animations';
import { Coordinates } from './position';

export interface LevelFourEnemyDefinition {
  id: string;
  startPos: Coordinates;
  textureKey: string;
  bounds: {
    left: number;
    right: number;
  };
  damage: number;
}

export interface LevelFourEnemy {
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  definition: LevelFourEnemyDefinition;
  mapBounds: {
    left: number;
    right: number;
  };
}
