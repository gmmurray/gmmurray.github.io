import { LevelScene } from '../scenes/LevelScene';
import { PositionMarker } from './position';

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
  ITEM,
}

export interface GetAndPerformInteractionParams {
  type: InteractionType;
  level: number;
  tileX: number;
  tileY: number;
  charId?: string;
  scene: LevelScene;
}

export interface ItemDefinition extends PositionMarker {
  handler: PerformInteraction;
}
