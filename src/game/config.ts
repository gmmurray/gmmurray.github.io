import AnimatedTilesPlugin from 'phaser-animated-tiles-phaser3.5';
import DialogPlugin from './dialog/plugin';
import { GridEngine } from 'grid-engine';
import { LevelOne } from './scenes/LevelOne';
import { LoadingScene } from './scenes/LoadingScene';
import Phaser from 'phaser';
import {
  ANIMATED_TILES_PLUGIN_KEY,
  DIALOG_PLUGIN_KEY,
  GRID_ENGINE_PLUGIN_KEY,
  HUD_PLUGIN_KEY,
  TILE_SIZE,
} from './constants';
import HudPlugin from './hud/plugin';
import { getMaxSquareScreenDimension } from './helpers/gameDimensions';

const startingDimensions = getMaxSquareScreenDimension(
  window.innerWidth,
  window.innerHeight,
  TILE_SIZE,
);

export const gameConfig = {
  title: 'gmmurray-game',
  type: Phaser.CANVAS,
  parent: 'game',
  //backgroundColor: '#050A2B',
  physics: {
    default: 'arcade',
    arcade: {
      debug: process.env.NODE_ENV === 'development',
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  width: startingDimensions,
  height: startingDimensions,
  // canvas: document.getElementById('game-canvas'),
  // canvasStyle: `width: ${startingDimensions}px; height: ${startingDimensions}px; border: 2px solid #976F08`,
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },
  scene: [LoadingScene, LevelOne],
  plugins: {
    scene: [
      {
        key: GRID_ENGINE_PLUGIN_KEY,
        plugin: GridEngine,
        mapping: GRID_ENGINE_PLUGIN_KEY,
      },
      {
        key: DIALOG_PLUGIN_KEY,
        plugin: DialogPlugin,
        mapping: DIALOG_PLUGIN_KEY,
      },
      {
        key: ANIMATED_TILES_PLUGIN_KEY,
        plugin: AnimatedTilesPlugin,
        mapping: ANIMATED_TILES_PLUGIN_KEY,
      },
      {
        key: HUD_PLUGIN_KEY,
        plugin: HudPlugin,
        mapping: HUD_PLUGIN_KEY,
      },
    ],
  },
};
