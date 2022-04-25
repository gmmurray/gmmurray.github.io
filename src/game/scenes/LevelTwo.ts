import {
  DEFAULT_FIRE_ANIMATION_FPS,
  LEVEL_TWO_SCENE_KEY,
  PILLAR_ONE_ACTIVE_NAME,
  PILLAR_THREE_ACTIVE_NAME,
  PILLAR_TWO_ACTIVE_NAME,
  PORTAL_ACTIVE_NAME,
  RANDOM_MOVEMENT_DELAY,
  TILEMAPLAYER_TYPE,
} from '../constants';
import {
  FireColor,
  FireNumber,
  ILevelTwoProgress,
  IPillarOneState,
  IPillarThreeState,
  IPillarTwoState,
  LevelTwoItem,
  LevelTwoProgress,
  PillarThreeState,
  PuzzleFires,
} from '../types/levelTwo';
import {
  angelMessages,
  fireStartLocations,
  levelTwoCast,
  pillarTwoSolutions,
} from '../cast/levelTwo';
import {
  fireSpriteDefinitions,
  gregSpriteDefinition,
} from '../assetDefinitions/sprites';
import { getRandomSolution, shuffleArray } from '../helpers/solutions';
import { showAlert, showConfirm } from '../helpers/sweetAlerts';

import { LevelScene } from './LevelScene';
import { LevelTwoSavedData } from '../types/savedData';
import McDialogPlugin from '../mcDialog/plugin';
import { convertSecondsToTimeString } from '../helpers/time';
import { getFireColorName } from '../helpers/fireColor';
import { levelTwoMapDefinition } from '../assetDefinitions/tiles';
import { randomEnum } from '../helpers/randomEnum';

export class LevelTwo extends LevelScene {
  private progress: ILevelTwoProgress;
  private pillarOneState: IPillarOneState;
  private pillarTwoState: IPillarTwoState;
  private puzzleFireState: IPillarThreeState;
  private _timerInterval: NodeJS.Timeout;
  private _timerElapsed: number = 0;

  public mcDialog: McDialogPlugin;

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
      ._createPillarTwoSolution()
      ._createPillarThreeSolution();

    this.dialog.init();
    this.hud.init();
    this.mcDialog.init();

    this.handleCloseDialog();

    this._initializeCharacterMovement();
    this._addPillarTrackerHudText();
    this._initializeCurrentRecord();
    this.loadUnlockedFeatures();

    this._timerInterval = this._timerInterval ?? this._addTimerInterval();

    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.hud.updateDimensions(gameSize);
      this.dialog.updateDimensions(gameSize);
      this.mcDialog.updateDimensions(gameSize);
    });
  };

  public update = () => {
    this.useGridPlayerControls()
      .setFacing()
      ._handleMcDialogStatus();
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

    if (this.isDev) {
      console.log(
        Object.values(solution).map(color => getFireColorName(color)),
      );
    }

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
      i => i.pillar === 1 && i.hint !== undefined,
    );
    const solution = getRandomSolution(options);
    if (!solution) {
      throw new Error('Unable to create pillar one solution');
    }

    const { friendlyName: itemName, hint } = solution;

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
      this.createNewDialog(`You find a key in the ${itemName}!`);
    } else {
      this.createNewDialog(`It appears to be a regular old ${itemName}`);
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

  private _completePillar = (pillar: 1 | 2 | 3, skip = false) => {
    this.progress = {
      ...this.progress,
      [pillar]: {
        ...this.progress[pillar],
        completed: true,
      },
    };
    this._activatePillar(pillar);

    if (!skip && this._isLevelComplete()) {
      this._completeLevel();
    }

    return this;
  };

  private _isLevelComplete = () => this._getNumCompletedPillars() === 3;

  private _getNumCompletedPillars = () =>
    [
      this.progress[1].completed,
      this.progress[2].completed,
      this.progress[3].completed,
    ].filter(p => !!p).length;

  private _completeLevel = (skipped = false) => {
    clearInterval(this._timerInterval);
    if (!skipped) {
      const isRecord = this._saveTime();
      if (isRecord) {
        showAlert(
          'New record',
          'Good job, this is your fastest clear of this level',
        );
        this._displayRecord(this._timerElapsed);
      }
    } else {
      this._timerElapsed = 0;
      this._completePillar(1, true)
        ._completePillar(2, true)
        ._completePillar(3, true)
        ._addPillarTrackerHudText(this._getNumCompletedPillars());
    }
    this.createNewDialog('You hear the sound of a portal opening up nearby...');
    this._activatePortal();
  };

  public handleAngelInteraction = () => {
    const numComplete = this._getNumCompletedPillars();

    this.createNewDialog(angelMessages[numComplete]);
  };

  public handlePillarTwoInteraction = () => {
    if (this.mcDialog.visible) return;
    if (this.pillarTwoState.isComplete) {
      this.createNewDialog('Well done, the power of this obelisk is yours');
      this._completePillar(2);
      return;
    }

    this._createMultipleChoiceDialog();
  };

  private _createPillarTwoSolution = () => {
    const solution = getRandomSolution(pillarTwoSolutions);

    this.pillarTwoState = {
      solution: {
        ...solution,
        options: shuffleArray(solution.options),
      },
      isComplete: false,
    };

    return this;
  };

  public handlePillarTwoAnswerChoice = (answer: number) => {
    this._removeMultipleChoiceDialog();
    if (answer == this.pillarTwoState.solution.answer) {
      this.pillarTwoState = {
        ...this.pillarTwoState,
        isComplete: true,
      };
      return this.handlePillarTwoInteraction(); // completes pillar
    }

    this.createNewDialog(
      'Sorry, that is not the correct answer. Maybe Greg can help with the next one?',
    );
    this._createPillarTwoSolution(); // create a new solution so they can't just brute force the answer (where's the fun in that?)
  };

  private _createMultipleChoiceDialog = () => {
    const { question, options } = this.pillarTwoState.solution;
    this.mcDialog.setQuestionText(question);
    this.mcDialog.setOptionsText(options);
    this.mcDialog.setOnSelect(this.handlePillarTwoAnswerChoice);
    this.mcDialog.toggleWindow(true);
    this.toggleMovement();
  };

  private _removeMultipleChoiceDialog = () => {
    this.toggleMovement();
    this.mcDialog.toggleWindow(false);
  };

  public handleGregInteraction = () => {
    if (this.pillarTwoState.isComplete) {
      return this.createNewDialog(`Seems like you don't need help from me.`);
    }
    this.createNewDialog(this.pillarTwoState.solution.hint);
  };

  private _initializeCharacterMovement = () => {
    const greg = this.characters.find(
      c => c.definition.key === gregSpriteDefinition.key,
    );
    this.gridEngine.moveRandomly(
      greg.definition.key,
      RANDOM_MOVEMENT_DELAY,
      greg.startingSpeed + 1,
    );
  };

  private _handleMcDialogStatus = () => {
    if (!this.mcDialog.visible && this.isMovementPaused) this.toggleMovement();
  };

  private _addPillarTrackerHudText = (count: number = 0, time = 0) => {
    this.hud.updateTopLeftText(
      `Pillars unlocked: ${count}/3`,
      `Time: ${convertSecondsToTimeString(time)}`,
    );
  };

  private _addTimerInterval = () =>
    setInterval(() => {
      const newTime = this._timerElapsed + 1;
      this._addPillarTrackerHudText(this._getNumCompletedPillars(), newTime);
      this._timerElapsed = newTime;
    }, 1000);

  private _saveTime = () => {
    const { time } = this.loadLevelSavedData<LevelTwoSavedData>() ?? {};
    if (!time || this._timerElapsed < time) {
      this.saveLevelData<LevelTwoSavedData>({ time: this._timerElapsed });
      return true;
    }
    return false;
  };

  private _initializeCurrentRecord = () => {
    const { time } = this.loadLevelSavedData<LevelTwoSavedData>() ?? {};
    if (time !== undefined) {
      this._displayRecord(time);
    }
  };

  private _displayRecord = (seconds: number) =>
    this.hud.updateTopCenterText(
      `Record: ${convertSecondsToTimeString(seconds)}`,
    );

  private _activatePortal = () => {
    const layers = this.children.list.filter(
      go => go.type === TILEMAPLAYER_TYPE,
    ) as Phaser.Tilemaps.TilemapLayer[];
    const activeLayer = layers.find(l => l.layer.name === PORTAL_ACTIVE_NAME);
    if (activeLayer) {
      let interval = setInterval(() => {
        activeLayer.setAlpha(activeLayer.alpha + 0.1);

        if (activeLayer.alpha === 1) clearInterval(interval);
      }, 200);
    }

    this.setPortals();
    return this;
  };

  public handleSkipButton = () => {
    // const confirmed = confirm(
    //   'Are you sure? Pressing this button will skip all the fun stuff on this level and grant you access to the rewards and ability to leave this level',
    // );
    // if (confirmed) {
    //   this.createNewDialog('You press the strange button...');
    //   this._completeLevel(true);
    // }
    showConfirm(
      'Pressing this button will skip all the fun stuff on this level and grant you access to the rewards and ability to leave this level',
      this._onSkip,
    );
  };

  private _onSkip = () => {
    this.createNewDialog('You press the strange button...');
    this._completeLevel(true);
  };
}
