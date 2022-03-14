import { Coordinates, PositionMarker } from './position';
import { GameObjects } from 'phaser';
import { InteractionType } from './interactions';

export interface TileObject extends PositionMarker {
  x: number;
  y: number;
  sprite: GameObjects.Sprite;
  type: InteractionType;
  name: string;
}

export interface DoorDefinition extends PositionMarker {
  from: Coordinates[];
  to: Coordinates;
}

export enum PortalType {
  SCENE,
  COORDINATE,
}

export interface PortalDefinition extends PositionMarker {
  from: Coordinates;
  type: PortalType;
  to: string | Coordinates;
  dialog?: string;
}
