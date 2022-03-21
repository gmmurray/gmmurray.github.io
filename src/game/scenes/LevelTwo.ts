import { LEVEL_TWO_SCENE_KEY } from '../constants';
import { LevelScene } from './LevelScene';
import { levelTwoCast } from '../cast/levelTwo';
import { levelTwoMapDefinition } from '../assetDefinitions/tiles';

export class LevelTwo extends LevelScene {
  constructor() {
    super(LEVEL_TWO_SCENE_KEY);
    this.levelNumber = 2;
    this.mapDefinition = levelTwoMapDefinition;
    this.cast = levelTwoCast;
  }

  public create = () => {
    this.setCharacters()
      .setItems()
      .setPortals()
      .setDoors()
      .setCamera()
      .setMap()
      .setCharacterLayerTransitions()
      .attachKeyboardListener();

    this.dialog.init();
    this.hud.init();

    this.scale.on('resize', this.hud.updateDimensions);
  };

  public update = () => {
    this.useGridPlayerControls().setFacing();
  };
}
