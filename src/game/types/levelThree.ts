import { Coordinates } from './position';
import { ItemDefinition } from './interactions';

export enum PotionType {
  MINI_HEALTH,
  HEALTH,
  SPEED,
}

export interface LevelThreeItem extends ItemDefinition {}
