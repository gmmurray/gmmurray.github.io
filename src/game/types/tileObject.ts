import { Coordinates } from './position';
import { GameObjects } from 'phaser';
import { InteractionType } from './interactions';

export interface TileObject {
  x: number;
  y: number;
  sprite: GameObjects.Sprite;
  type: InteractionType;
  name: string;
}

export interface DoorDefinition {
  from: Coordinates[];
  to: Coordinates;
}

export enum PortalType {
  SCENE,
  COORDINATE,
}

export interface PortalDefinition {
  from: Coordinates;
  type: PortalType;
  to: string | Coordinates;
  dialog?: string;
}
