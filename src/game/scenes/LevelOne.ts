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
  }

  create = () => {
    this.createCharacters()
      .createItems()
      .createPortals()
      .createDoors()
      .setCamera()
      .setMap()
      .attachKeyboardListener();

    this.dialog.init();
    this.hud.init();

    this.createNewDialog(
      'hint: talk to Greg using space or enter to get started',
    );

    this.initialCharacterMovement();
  };

  update = () => {
    this.useGridPlayerControls().setFacing();
  };

  public createCharacters = () =>
    this.setCharacters(levelOneCast.player, levelOneCast.npcs);

  public createItems = () => this.setItems(levelOneCast.items);

  public createPortals = () => this.setPortals(levelOneCast.portals);

  public createDoors = () => this.setDoors(levelOneCast.doors);

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
    this.gridEngine.moveTo(greg.definition.key, { x: 25, y: 50 });
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
