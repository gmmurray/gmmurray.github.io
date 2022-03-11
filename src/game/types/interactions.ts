export interface InteractionLookup {
  [key: string]: () => any;
}

export type InteractionOperation = (id: string) => void;

export interface InteractionTypeLookup {
  [key: string]: InteractionOperation;
}

export enum InteractionType {}

export interface GetAndPerformInteractionParams {
  type: InteractionType;
  level: number;
  tileX: number;
  tileY: number;
}
