import React, { useCallback, useEffect } from 'react';
import { overlayActions, overlaySelectors } from '../redux/overlaySlice';
import { useDispatch, useSelector } from 'react-redux';

import Icon from '@mdi/react';
import { Typewriter } from 'react-simple-typewriter';
import { gameCmsActions } from '../redux/gameCmsSlice';
import { mdiClose } from '@mdi/js';
import { overlayContentMapping } from './contentMapping';
import { useGameContext } from '../GameContext';

const GameOverlayComponent = () => {
  const dispatch = useDispatch();
  const { dimension, game } = useGameContext();
  const { pausedScene, contentKey } = useSelector(
    overlaySelectors.selectOverlayState,
  );
  const content = overlayContentMapping[contentKey];

  const handleClose = useCallback(() => {
    game.scene.resume(pausedScene);
    dispatch(overlayActions.overlayClosed());
    dispatch(gameCmsActions.selectedTalentTreeChanged(0));
  }, []);

  const handleInnerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Escape':
        case 'Space':
        case 'Enter':
          handleClose();
          break;
        default:
          return;
      }
    },
    [handleClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="game-overlay game-overlay-container">
      <div
        className="game-overlay-backdrop"
        style={{ height: dimension, width: dimension }}
      >
        <div className="game-overlay-message-container" onClick={handleClose}>
          <div className="game-overlay-message" onClick={handleInnerClick}>
            <div className="close-button-container">
              <button className="button is-small" onClick={handleClose}>
                <Icon path={mdiClose} size={1} />
              </button>
            </div>
            <div className="game-overlay-main-container">
              {content.lead && (
                <div className="lead-section">
                  <Typewriter words={[content.lead]} typeSpeed={30} />
                </div>
              )}
              {content.component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverlayComponent;
