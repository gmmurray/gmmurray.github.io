import { LevelScene } from '../scenes/LevelScene';

export type PerformInteraction = (
  params: GetAndPerformInteractionParams,
) => any;

export interface InteractionLookup {
  [key: string]: PerformInteraction;
}

export type InteractionOperation = (
  id: string,
  params: GetAndPerformInteractionParams,
) => void;

export interface InteractionTypeLookup {
  [key: number]: InteractionOperation;
}

export enum InteractionType {
  DOOR,
  PORTAL,
  CHAR,
}

export interface GetAndPerformInteractionParams {
  type: InteractionType;
  level: number;
  tileX: number;
  tileY: number;
  charId?: string;
  scene: LevelScene;
}
