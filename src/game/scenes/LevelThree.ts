import {
  LEVEL_THREE_SCENE_KEY,
  ORB_LAYER_NAME,
  POTION_LAYER_NAME,
} from '../constants';

import { Coordinates } from '../types/position';
import { LevelScene } from './LevelScene';
import { PotionType } from '../types/levelThree';
import { levelThreeCast } from '../cast/levelThree';
import { levelThreeMapDefinition } from '../assetDefinitions/tiles';

export class LevelThree extends LevelScene {
  constructor() {
    super(LEVEL_THREE_SCENE_KEY);
    this.levelNumber = 3;
    this.mapDefinition = levelThreeMapDefinition;
    this.cast = levelThreeCast;
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

    this.handleCloseDialog();

    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.hud.updateDimensions(gameSize);
      this.dialog.updateDimensions(gameSize);
    });
  };

  public update = () => {
    this.useGridPlayerControls().setFacing();
  };

  public handlePotionConsume = (type: PotionType, coordinates: Coordinates) => {
    switch (type) {
      case PotionType.MINI_HEALTH:
        this._takeHealthPotion(true);
        break;
      case PotionType.HEALTH:
        this._takeHealthPotion();
        break;
      case PotionType.SPEED:
        this._takeSpeedPotion();
        break;
    }
    this.map.removeTileAt(
      coordinates.x,
      coordinates.y,
      true,
      true,
      POTION_LAYER_NAME,
    );
    this.removeItem(coordinates);
  };

  public handleOrbCollection = (
    primaryTile: Coordinates,
    allTiles: Coordinates[],
  ) => {
    alert('orb 1 collected');
    allTiles.forEach(tile =>
      this.map.removeTileAt(tile.x, tile.y, true, true, ORB_LAYER_NAME),
    );
    this.removeItem(allTiles[1]);
  };

  private _takeHealthPotion = (isMini: boolean = false) => {
    const amount = isMini ? 0.5 : 1;
    alert(`+${amount}hp`); // TODO:
  };

  private _takeSpeedPotion = () => {
    alert('double speed for 30 seconds');
  };
}
