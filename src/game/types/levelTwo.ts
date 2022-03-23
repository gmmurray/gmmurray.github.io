import { Coordinates } from './position';
import { LevelCast } from './interactions';

export interface PillarProgress {
  completed: boolean;
}

export interface PillarSolution {
  id: string;
}

export interface PillarOneSolution extends PillarSolution {
  location: Coordinates;
  hint: string;
}

export interface PillarTwoSolution extends PillarSolution {
  options: { id: string; text: string }[];
  answer: string; // correct answer id
}

export interface PillarThreeSolution extends PillarSolution {
  elements: FireColor[];
}

export interface ILevelTwoProgress {
  pillarOne: PillarProgress;
  pillarTwo: PillarProgress;
  pillarThree: PillarProgress;
}

export class LevelTwoProgress implements ILevelTwoProgress {
  public pillarOne: PillarProgress;
  public pillarTwo: PillarProgress;
  public pillarThree: PillarProgress;

  constructor() {
    this.pillarOne = this._createProgress();
    this.pillarTwo = this._createProgress();
    this.pillarThree = this._createProgress();
  }

  private _createProgress = (): PillarProgress => ({
    completed: false,
  });
}

export enum FireColor {
  GREEN,
  BLUE,
  WHITE,
  PURPLE,
}

export enum FireNumber {
  ONE,
  TWO,
  THREE,
  FOUR,
}

export interface PuzzleFires {
  active: FireColor;
  fires: {
    [FireColor.GREEN]: {
      sprite: Phaser.GameObjects.Sprite;
      animation: Phaser.Animations.Animation;
      characterId: string;
    };
    [FireColor.BLUE]: {
      sprite: Phaser.GameObjects.Sprite;
      animation: Phaser.Animations.Animation;
      characterId: string;
    };
    [FireColor.WHITE]: {
      sprite: Phaser.GameObjects.Sprite;
      animation: Phaser.Animations.Animation;
      characterId: string;
    };
    [FireColor.PURPLE]: {
      sprite: Phaser.GameObjects.Sprite;
      animation: Phaser.Animations.Animation;
      characterId: string;
    };
  };
}

export interface IPuzzleFireState {
  [FireNumber.ONE]: PuzzleFires;
  [FireNumber.TWO]: PuzzleFires;
  [FireNumber.THREE]: PuzzleFires;
  [FireNumber.FOUR]: PuzzleFires;
  solution: Record<FireNumber, FireColor>;
}

export class PuzzleFireState implements IPuzzleFireState {
  public [FireNumber.ONE]: PuzzleFires;
  public [FireNumber.TWO]: PuzzleFires;
  public [FireNumber.THREE]: PuzzleFires;
  public [FireNumber.FOUR]: PuzzleFires;
  public solution: Record<FireNumber, FireColor>;

  constructor() {
    this[FireNumber.ONE] = this._createFireState();
    this[FireNumber.TWO] = this._createFireState();
    this[FireNumber.THREE] = this._createFireState();
    this[FireNumber.FOUR] = this._createFireState();
  }

  private _createFireState = () => ({
    active: null,
    fires: {
      [FireColor.GREEN]: {
        sprite: null,
        animation: null,
        characterId: null,
      },
      [FireColor.BLUE]: {
        sprite: null,
        animation: null,
        characterId: null,
      },
      [FireColor.WHITE]: {
        sprite: null,
        animation: null,
        characterId: null,
      },
      [FireColor.PURPLE]: {
        sprite: null,
        animation: null,
        characterId: null,
      },
    },
  });
}
