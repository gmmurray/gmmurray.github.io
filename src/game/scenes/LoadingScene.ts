import {
  gregSpriteDefinition,
  playerSpriteDefinition,
} from '../assetDefinitions/sprites';

import { ASSETS_BASE_URL } from '../constants';
import { Scene } from 'phaser';
import { levelOneMapDefinition } from '../assetDefinitions/tiles';

const spriteDefinitions = [playerSpriteDefinition, gregSpriteDefinition];
const tileDefinitions = [levelOneMapDefinition];

export class LoadingScene extends Scene {
  constructor() {
    super('loading-scene');
  }

  preload = () => {
    this.load.baseURL = ASSETS_BASE_URL;

    this.loadSprites();

    this.loadTiles();
  };

  create = () => {
    this.scene.start('level-one');
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
