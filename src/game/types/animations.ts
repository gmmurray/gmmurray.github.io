export interface AnimationDefinition {
  key: string;
  frames: number[];
  frameRate?: number;
  repeat?: number;
}

export interface AnimationDefinitionMap {
  [key: string]: AnimationDefinition;
}
