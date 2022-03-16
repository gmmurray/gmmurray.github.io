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
import { getGameWidth, getGameHeight } from '../helpers/gameDimensions';

const spriteDefinitions = [
  playerSpriteDefinition,
  gregSpriteDefinition,
  greyCatSpriteDefinition,
  whiteCatSpriteDefinition,
];
const tileDefinitions = [levelOneMapDefinition];

// https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/ loading bar tutorial
export class LoadingScene extends Scene {
  constructor() {
    super(LOADING_SCENE_KEY);
  }

  public preload = () => {
    this._setBaseLoadUrl()
      ._loadSprites()
      ._loadTiles()
      ._loadImages();
  };

  public create = () => {
    this._initializeBackground()
      ._showLogoIntro()
      ._startFirstScene();
  };

  private _setBaseLoadUrl = () => {
    this.load.baseURL = ASSETS_BASE_URL;
    return this;
  };

  private _loadSprites = () => {
    spriteDefinitions.forEach(({ key, source, frameWidth, frameHeight }) => {
      this.load.spritesheet(key, source, { frameWidth, frameHeight });
    });

    return this;
  };

  private _loadTiles = () => {
    tileDefinitions.forEach(({ key, source, tilesets }) => {
      this.load.tilemapTiledJSON(key, source);

      tilesets.forEach(({ key: tsKey, source: tsSource }) => {
        this.load.image(tsKey, tsSource);
      });
    });

    return this;
  };

  private _loadImages = () => {
    this.load.image('logo', 'images/logo.png');

    return this;
  };

  private _initializeBackground = () => {
    this.cameras.main.setBackgroundColor('#050A2B');
    return this;
  };

  private _showLogoIntro = () => {
    const width = this._getGameWidth() / 2;
    const height = this._getGameHeight() / 2;
    this.add.image(width, height, 'logo').setScale(0.25);
    return this;
  };

  private _startFirstScene = () => {
    setTimeout(() => {
      this.cameras.main.setBackgroundColor('#000');
      this.scene.start(LEVEL_ONE_SCENE_KEY);
    }, 1000);
    return this;
  };

  private _getGameWidth = () => getGameWidth(this);

  private _getGameHeight = () => getGameHeight(this);
}
