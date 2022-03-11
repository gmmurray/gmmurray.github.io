import { LevelScene } from './LevelScene';
import { levelOneMapDefinition } from '../assetDefinitions/tiles';

export class LevelOne extends LevelScene {
  constructor() {
    super('level-one');
    this.levelNumber = 1;
    this.startingGridCoordinates.x = 28;
    this.startingGridCoordinates.y = 22;
    this.mapDefinition = levelOneMapDefinition;
  }

  create = () => {
    this.setMap();

    this.setPlayerSprite();

    this.setCamera();

    this.setObjects();

    this.attachKeyboardListener();
  };

  update = () => {
    this.useGridPlayerControls();
    this.setFacingObject();
  };
}
