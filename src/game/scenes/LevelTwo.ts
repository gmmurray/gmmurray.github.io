import {
  DEFAULT_FIRE_ANIMATION_FPS,
  LEVEL_TWO_SCENE_KEY,
  PILLAR_ONE_ACTIVE_NAME,
  PILLAR_THREE_ACTIVE_NAME,
  PILLAR_TWO_ACTIVE_NAME,
  TILEMAPLAYER_TYPE,
} from '../constants';
import {
  FireColor,
  FireNumber,
  ILevelTwoProgress,
  IPillarOneState,
  IPillarThreeState,
  LevelTwoItem,
  LevelTwoProgress,
  PillarThreeState,
  PuzzleFires,
} from '../types/levelTwo';
import { fireStartLocations, levelTwoCast } from '../cast/levelTwo';

import { LevelScene } from './LevelScene';
import { fireSpriteDefinitions } from '../assetDefinitions/sprites';
import { getFireColorName } from '../helpers/fireColor';
import { levelTwoMapDefinition } from '../assetDefinitions/tiles';
import { randomEnum } from '../helpers/randomEnum';

export class LevelTwo extends LevelScene {
  public puzzleFireState: IPillarThreeState;
  private progress: ILevelTwoProgress;
  private pillarOneState: IPillarOneState;

  constructor() {
    super(LEVEL_TWO_SCENE_KEY);
    this.levelNumber = 2;
    this.mapDefinition = levelTwoMapDefinition;
    this.cast = levelTwoCast;
    this.puzzleFireState = new PillarThreeState();
    this.progress = new LevelTwoProgress();
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
      ._initializeFireState()
      ._createPillarOneSolution()
      ._createPillarThreeSolution();

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
      this.puzzleFireState[num] = { ...this._makeFires(num) };
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
    const fire = this.puzzleFireState[number];
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
    if (this.progress[3].completed) {
      return this;
    }

    let nextColor: FireColor;
    switch (this.puzzleFireState[number].active) {
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

  public handlePillarThreeInteraction = () => {
    const isSolved = this._isPuzzleFireSolved();
    if (isSolved) {
      this.createNewDialog('Well done, the power of this obelisk is yours');
      this._completePillar(3);
      return;
    }

    const { solution } = this.puzzleFireState;
    const fire1 = getFireColorName(solution[FireNumber.ONE]);
    const fire2 = getFireColorName(solution[FireNumber.TWO]);
    const fire3 = getFireColorName(solution[FireNumber.THREE]);
    const fire4 = getFireColorName(solution[FireNumber.FOUR]);

    this.createNewDialog(
      `To solve this puzzle you must master the fire. Here's a hint: first comes ${fire1}, then comes ${fire2}. Master these and you are halfway there. Next is ${fire3} and finally there is ${fire4}. Start at 12 o'clock and you will unlock the power of this pillar.`,
    );
  };

  private _createPillarThreeSolution = () => {
    const solution = {} as Record<FireNumber, FireColor>;
    for (let i = 0; i < 4; i++) {
      const color = randomEnum(FireColor);
      solution[i as FireNumber] = color;
    }

    this.puzzleFireState = {
      ...this.puzzleFireState,
      solution,
    };

    console.log(Object.values(solution).map(color => getFireColorName(color)));

    return this;
  };

  private _isPuzzleFireSolved = () => {
    const { solution } = this.puzzleFireState;
    const { active: active1 } = this.puzzleFireState[FireNumber.ONE];
    const { active: active2 } = this.puzzleFireState[FireNumber.TWO];
    const { active: active3 } = this.puzzleFireState[FireNumber.THREE];
    const { active: active4 } = this.puzzleFireState[FireNumber.FOUR];

    return (
      solution[FireNumber.ONE] === active1 &&
      solution[FireNumber.TWO] === active2 &&
      solution[FireNumber.THREE] === active3 &&
      solution[FireNumber.FOUR] === active4
    );
  };

  private _activatePillar = (number: 1 | 2 | 3) => {
    let layerName: string;
    if (number === 1) {
      layerName = PILLAR_ONE_ACTIVE_NAME;
    } else if (number === 2) {
      layerName = PILLAR_TWO_ACTIVE_NAME;
    } else {
      layerName = PILLAR_THREE_ACTIVE_NAME;
    }
    const layers = this.children.list.filter(
      go => go.type === TILEMAPLAYER_TYPE,
    ) as Phaser.Tilemaps.TilemapLayer[];
    const activeLayer = layers.find(l => l.layer.name === layerName);
    if (activeLayer) {
      let interval = setInterval(() => {
        activeLayer.setAlpha(activeLayer.alpha + 0.1);

        if (activeLayer.alpha === 1) clearInterval(interval);
      }, 200);
    }

    return this;
  };

  private _createPillarOneSolution = () => {
    const options = (this.cast.items as LevelTwoItem[]).filter(
      i => i.hint && i.pillar && i.pillar === 1,
    );
    const answerIndex = Math.floor(Math.random() * (options.length - 1));
    const { friendlyName: itemName, hint } = options[answerIndex];

    this.pillarOneState = {
      solution: {
        itemName,
        hint,
      },
      isFound: false,
    };

    return this;
  };

  public handlePillarOneItemInteraction = (itemName: string) => {
    if (itemName === this.pillarOneState.solution.itemName) {
      this.pillarOneState.isFound = true;
      this.createNewDialog(`you find a key in the ${itemName}`);
    } else {
      this.createNewDialog(`it appears to be a regular old ${itemName}`);
    }
  };

  public handlePillarOneInteraction = () => {
    if (this.pillarOneState.isFound) {
      this.createNewDialog('Well done, the power of this obelisk is yours');
      this._completePillar(1);
      return;
    }

    this.createNewDialog(
      `Unlocking this pillar is truly random, but here's a hint: ${this.pillarOneState.solution.hint}`,
    );
  };

  private _completePillar = (pillar: 1 | 2 | 3) => {
    this.progress = {
      ...this.progress,
      [pillar]: {
        ...this.progress[pillar],
        completed: true,
      },
    };
    this._activatePillar(pillar);

    if (this._isLevelComplete()) {
      this._completeLevel();
    }
  };

  private _isLevelComplete = () => this._getNumCompletedPillars() === 3;

  private _getNumCompletedPillars = () =>
    [
      this.progress[1].completed,
      this.progress[2].completed,
      this.progress[3].completed,
    ].filter(p => !!p).length;

  private _completeLevel = () => {
    // TODO: open portal to treasure room which contains experiences and portal to L1
  };

  public handleAngelInteraction = () => {
    let message: string;
    const numComplete = this._getNumCompletedPillars();
    if (numComplete === 0) {
      // TODO: angel message
    } else if (numComplete === 1) {
      // TODO: angel message
    } else if (numComplete === 2) {
      // TODO: angel message
    } else if (numComplete === 3) {
      // TODO: angel message
    }
    this.createNewDialog(message);
  };

  public handlePillarTwoInteraction = () => {
    if (1 === 1) {
      // replace with completion parameter
      this.createNewDialog('Well done, the power of this obelisk is yours');
      this._completePillar(1);
      return;
    }
    // TODO: handle interaction when the question is not answered
    this.createNewDialog('');
  };
}
