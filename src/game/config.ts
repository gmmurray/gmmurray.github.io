import DialogPlugin from './dialog/plugin';
import { GridEngine } from 'grid-engine';
import { LevelOne } from './scenes/LevelOne';
import { LoadingScene } from './scenes/LoadingScene';
import Phaser from 'phaser';

export const gameConfig = {
  title: 'gmmurray-game',
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#000',
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
  canvasStyle: `width: 600px; height: 600px;`,
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },
  scene: [LoadingScene, LevelOne],
  plugins: {
    scene: [
      {
        key: 'gridEngine',
        plugin: GridEngine,
        mapping: 'gridEngine',
      },
      {
        key: 'dialog',
        plugin: DialogPlugin,
        mapping: 'dialog',
      },
    ],
  },
};
