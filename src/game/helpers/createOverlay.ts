import { OverlayContentKey } from '../types/overlayContent';
import Phaser from 'phaser';
import { overlayActions } from '../redux/overlaySlice';
import { store } from '../redux/store';

export const createOverlay = (
  contentKey: OverlayContentKey,
  scene: Phaser.Scenes.ScenePlugin,
) => {
  scene.pause();
  store.dispatch(
    overlayActions.overlayOpened({
      contentKey,
      pausedScene: scene.key,
    }),
  );
};
