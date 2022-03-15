export interface SpriteDefinition {
  key: string;
  source: string;
  frameWidth: number;
  frameHeight: number;
  walkingAnimationMapping: number;
  scale: number;
}

export interface TileSetDefinition {
  name: string;
  key: string;
  source: string;
}

export interface TileMapDefinition {
  key: string;
  source: string;
  animatedLayer: string;
  tilesets: TileSetDefinition[];
}
