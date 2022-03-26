import { OverlayContentKey } from '../types/overlayContent';
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
