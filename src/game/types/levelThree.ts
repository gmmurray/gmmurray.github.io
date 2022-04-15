import { Coordinates } from './position';
import { ItemDefinition } from './interactions';

export enum PotionType {
  MINI_HEALTH,
  HEALTH,
  SPEED,
}

export interface LevelThreeItem extends ItemDefinition {}

export enum LevelThreeDifficulty {
  EASY,
  NORMAL,
  HEROIC,
  LEGENDARY,
  NIGHTMARE,
}

export interface LevelThreeState {
  orbs: {
    1: boolean;
    2: boolean;
    3: boolean;
  };
  health: number;
  difficultySettings: LevelThreeDifficultySettings;
  standingInFire: boolean;
  fireIsActive: boolean;
  steppedOnFire?: Coordinates;
}

export interface OrbDefinition {
  location: {
    primary: Coordinates;
    all: Coordinates[];
  };
}

export interface OrbMap {
  1: OrbDefinition;
  2: OrbDefinition;
  3: OrbDefinition;
}

export interface LevelThreeDifficultySettings {
  healthPotions: {
    mini: number;
    normal: number;
  };
  enemy: {
    damageMod: number;
    critsEnabled: boolean;
    speedMod: number;
    followEnabled: boolean;
  };
  fire: {
    speedModifier: number;
    damageModifier: number;
  };
}

export interface LevelThreeDifficultySettingsMap {
  [LevelThreeDifficulty.EASY]: LevelThreeDifficultySettings;
  [LevelThreeDifficulty.NORMAL]: LevelThreeDifficultySettings;
  [LevelThreeDifficulty.HEROIC]: LevelThreeDifficultySettings;
  [LevelThreeDifficulty.LEGENDARY]: LevelThreeDifficultySettings;
  [LevelThreeDifficulty.NIGHTMARE]: LevelThreeDifficultySettings;
}

export interface LevelThreeDamagingFireDefinition {
  key: string;
  source: string;
  frameWidth: number;
  frameHeight: number;
  scale: number;
  frameCount: number;
  frameRate: number;
}
