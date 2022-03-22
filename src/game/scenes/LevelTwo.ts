import { DEFAULT_FIRE_ANIMATION_FPS, LEVEL_TWO_SCENE_KEY } from '../constants';
import {
  FireColor,
  FireNumber,
  PuzzleFireState,
  PuzzleFires,
} from '../types/levelTwo';
import { fireStartLocations, levelTwoCast } from '../cast/levelTwo';

import { LevelScene } from './LevelScene';
import { SpriteDefinition } from '../types/assetDefinitions';
import { fireSpriteDefinitions } from '../assetDefinitions/sprites';
import { levelTwoMapDefinition } from '../assetDefinitions/tiles';

export class LevelTwo extends LevelScene {
  private _puzzleFireState: PuzzleFireState;

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

    this._initializeFireState();

    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.hud.updateDimensions(gameSize);
      this.dialog.updateDimensions(gameSize);
    });
  };

  public update = () => {
    this.useGridPlayerControls().setFacing();
  };

  private _initializeFireState = () => {
    const fireNumbers = [
      FireNumber.ONE,
      FireNumber.TWO,
      FireNumber.THREE,
      FireNumber.FOUR,
    ];
    fireNumbers.forEach(num => {
      this._puzzleFireState[num] = {};
      this._puzzleFireState[num].fires = { ...this._makeFires(num) };
    });

    this._puzzleFireState[FireNumber.ONE].active = FireColor.WHITE;
    this._puzzleFireState[FireNumber.ONE].fires[
      FireColor.WHITE
    ].sprite.setVisible(true);
    this._puzzleFireState[FireNumber.ONE].fires[FireColor.WHITE].sprite.play(
      this._puzzleFireState[FireNumber.ONE].fires[FireColor.WHITE].animation
        .key,
    );
  };

  private _makeFires = (number: FireNumber): PuzzleFires => {
    const result: PuzzleFires = {
      active: FireColor.WHITE,
      fires: {
        [FireColor.BLUE]: null,
        [FireColor.WHITE]: null,
        [FireColor.GREEN]: null,
        [FireColor.PURPLE]: null,
      },
    };
    fireSpriteDefinitions.forEach(d => {
      const texture = d.key;
      const spriteKey = `${texture}-${number}`;
      const animKey = `${spriteKey}-flicker`;

      const sprite = this.add
        .sprite(0, 0, texture)
        .setScale(d.scale)
        .setVisible(false);

      const animation = this.anims.create({
        key: animKey,
        frameRate: DEFAULT_FIRE_ANIMATION_FPS,
        frames: this.anims.generateFrameNumbers(d.key, {
          start: 0,
          end: 7,
        }),
        repeat: -1,
      });

      this.gridEngine.addCharacter({
        id: spriteKey,
        startPosition: fireStartLocations[number],
        sprite,
      });

      result[d.color] = {
        sprite,
        animation,
      };
    });

    return result;
  };
}
