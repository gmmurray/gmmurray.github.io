import { DEFAULT_FIRE_ANIMATION_FPS, LEVEL_TWO_SCENE_KEY } from '../constants';
import {
  FireColor,
  FireNumber,
  IPuzzleFireState,
  PuzzleFireState,
  PuzzleFires,
} from '../types/levelTwo';
import { fireStartLocations, levelTwoCast } from '../cast/levelTwo';

import { LevelScene } from './LevelScene';
import { fireSpriteDefinitions } from '../assetDefinitions/sprites';
import { levelTwoMapDefinition } from '../assetDefinitions/tiles';

export class LevelTwo extends LevelScene {
  private _puzzleFireState: IPuzzleFireState;

  constructor() {
    super(LEVEL_TWO_SCENE_KEY);
    this.levelNumber = 2;
    this.mapDefinition = levelTwoMapDefinition;
    this.cast = levelTwoCast;
    this._puzzleFireState = new PuzzleFireState();
  }

  public create = () => {
    this.setCharacters()
      .setItems()
      .setPortals()
      .setDoors()
      .setCamera()
      .setMap()
      .setCharacterLayerTransitions()
      .attachKeyboardListener()
      ._initializeFireState();

    this.dialog.init();
    this.hud.init();

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
      this._puzzleFireState[num] = { ...this._makeFires(num) };
      this._changeActiveFire(num, FireColor.WHITE);
    });

    return this;
  };

  private _makeFires = (number: FireNumber): PuzzleFires => {
    const result: PuzzleFires = {
      active: null,
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
      }) as Phaser.Animations.Animation;

      sprite.play(animKey);

      result.fires[d.color] = {
        sprite,
        animation,
        characterId: spriteKey,
      };
    });

    return result;
  };

  private _changeActiveFire = (number: FireNumber, newColor: FireColor) => {
    const fire = this._puzzleFireState[number];
    const currColor = fire.active;
    const currPuzzleFire = fire.fires[currColor];

    const newPuzzleFire = fire.fires[newColor];

    if (currColor !== null) {
      // remove old grid character and turn off visibility
      currPuzzleFire.sprite.setVisible(false);
      this.gridEngine.removeCharacter(currPuzzleFire.characterId);
    }

    // add new grid character and turn on visibility
    newPuzzleFire.sprite.setVisible(true);
    this.gridEngine.addCharacter({
      id: newPuzzleFire.characterId,
      startPosition: fireStartLocations[number],
      sprite: newPuzzleFire.sprite,
    });
    fire.active = newColor;

    return this;
  };

  public showNextFire = (number: FireNumber) => {
    let nextColor: FireColor;
    switch (this._puzzleFireState[number].active) {
      case FireColor.WHITE:
        nextColor = FireColor.BLUE;
        break;
      case FireColor.BLUE:
        nextColor = FireColor.GREEN;
        break;
      case FireColor.GREEN:
        nextColor = FireColor.PURPLE;
        break;
      case FireColor.PURPLE:
        nextColor = FireColor.WHITE;
        break;
    }

    this._changeActiveFire(number, nextColor);

    return this;
  };
}
