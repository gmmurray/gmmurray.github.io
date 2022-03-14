import {
  gregSpriteDefinition,
  greyCatSpriteDefinition,
  playerSpriteDefinition,
  whiteCatSpriteDefinition,
} from '../assetDefinitions/sprites';

import {
  ASSETS_BASE_URL,
  LEVEL_ONE_SCENE_KEY,
  LOADING_SCENE_KEY,
} from '../constants';
import { Scene } from 'phaser';
import { levelOneMapDefinition } from '../assetDefinitions/tiles';

const spriteDefinitions = [
  playerSpriteDefinition,
  gregSpriteDefinition,
  greyCatSpriteDefinition,
  whiteCatSpriteDefinition,
];
const tileDefinitions = [levelOneMapDefinition];

export class LoadingScene extends Scene {
  constructor() {
    super(LOADING_SCENE_KEY);
  }

  preload = () => {
    this.load.baseURL = ASSETS_BASE_URL;

    this.loadSprites();

    this.loadTiles();
  };

  create = () => {
    this.scene.start(LEVEL_ONE_SCENE_KEY);
  };

  loadSprites = () => {
    spriteDefinitions.forEach(({ key, source, frameWidth, frameHeight }) => {
      this.load.spritesheet(key, source, { frameWidth, frameHeight });
    });
  };

  loadTiles = () => {
    tileDefinitions.forEach(({ key, source, tilesets }) => {
      this.load.tilemapTiledJSON(key, source);

      tilesets.forEach(({ key: tsKey, source: tsSource }) => {
        this.load.image(tsKey, tsSource);
      });
    });
  };
}
