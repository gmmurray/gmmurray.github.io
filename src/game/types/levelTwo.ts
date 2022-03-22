import { Coordinates } from './position';
import { LevelCast } from './interactions';
import { LevelProgress } from './levelProgress';

export interface PillarProgress {
  completed: boolean;
  solutionId: string;
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

export interface LevelTwoProgress extends LevelProgress {
  pillarOne: PillarProgress;
  pillarTwo: PillarProgress;
  pillarThree: PillarProgress;
}

export interface LevelTwoCast extends LevelCast {
  solutions: PillarSolution[];
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
    };
    [FireColor.BLUE]: {
      sprite: Phaser.GameObjects.Sprite;
      animation: Phaser.Animations.Animation;
    };
    [FireColor.WHITE]: {
      sprite: Phaser.GameObjects.Sprite;
      animation: Phaser.Animations.Animation;
    };
    [FireColor.PURPLE]: {
      sprite: Phaser.GameObjects.Sprite;
      animation: Phaser.Animations.Animation;
    };
  };
}

export interface PuzzleFireState {
  [FireNumber.ONE]: PuzzleFires;
  [FireNumber.TWO]: PuzzleFires;
  [FireNumber.THREE]: PuzzleFires;
  [FireNumber.FOUR]: PuzzleFires;
}
