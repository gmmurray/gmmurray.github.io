import { LEVEL_ONE_SCENE_KEY, RANDOM_MOVEMENT_DELAY } from '../constants';
import {
  gregSpriteDefinition,
  greyCatSpriteDefinition,
  whiteCatSpriteDefinition,
} from '../assetDefinitions/sprites';

import { LevelScene } from './LevelScene';
import { levelOneCast } from '../cast/levelOne';
import { levelOneMapDefinition } from '../assetDefinitions/tiles';

export class LevelOne extends LevelScene {
  constructor() {
    super(LEVEL_ONE_SCENE_KEY);
    this.levelNumber = 1;
    this.mapDefinition = levelOneMapDefinition;
    this.cast = levelOneCast;
  }

  public create = () => {
    this.setCharacters()
      .setItems()
      .setPortals()
      .setDoors()
      .setCamera()
      .setMap()
      .attachKeyboardListener();

    this.dialog.init();
    this.hud.init();

    if (!this.isDev) {
      this.createNewDialog(
        'hint: move using the arrow or WASD keys. interact using space or enter',
      );
    }

    this.initialCharacterMovement();
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.hud.updateDimensions(gameSize);
      this.dialog.updateDimensions(gameSize);
    });
  };

  public update = () => {
    this.useGridPlayerControls().setFacing();
  };

  public initialCharacterMovement = () => {
    const greg = this.characters.find(
      c => c.definition.key === gregSpriteDefinition.key,
    );
    const khufu = this.characters.find(
      c => c.definition.key === greyCatSpriteDefinition.key,
    );
    const dre = this.characters.find(
      c => c.definition.key === whiteCatSpriteDefinition.key,
    );

    // start with greg off screen and running towards player. then go to walking speed
    this.gridEngine.moveTo(greg.definition.key, { x: 24, y: 50 });
    this.gridEngine.setSpeed(greg.definition.key, 2);

    // start the cats mving around randomly with delay so they aren't synchronized
    this.gridEngine.moveRandomly(
      khufu.definition.key,
      RANDOM_MOVEMENT_DELAY,
      khufu.startingSpeed,
    );
    this.gridEngine.moveRandomly(
      dre.definition.key,
      RANDOM_MOVEMENT_DELAY + 200,
      dre.startingSpeed,
    );
  };
}
