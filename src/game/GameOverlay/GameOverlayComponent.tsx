import {
  INVENTORY_REACT_EVENT_KEY,
  QUESTS_REACT_EVENT_KEY,
  TALENTS_REACT_EVENT_KEY,
} from '../constants';
import React, { useCallback, useEffect } from 'react';
import { overlayActions, overlaySelectors } from '../redux/overlaySlice';
import { useDispatch, useSelector } from 'react-redux';

import Icon from '@mdi/react';
import { Typewriter } from 'react-simple-typewriter';
import classNames from 'classnames';
import { combineCss } from '../helpers/combineCss';
import { gameCmsActions } from '../redux/gameCmsSlice';
import { mdiClose } from '@mdi/js';
import { overlayContentMapping } from './contentMapping';
import { useGameContext } from '../GameContext';

const base_cn = 'game-overlay';
const container_cn = combineCss(base_cn, 'container');
const backdrop_cn = combineCss(base_cn, 'backdrop');
const message_cn = combineCss(base_cn, 'message');
const message_container_cn = combineCss(message_cn, 'container');
const message_container_close_button_cn = combineCss(
  message_cn,
  'close-button',
);
const message_container_close_button_container_cn = combineCss(
  message_container_close_button_cn,
  'container',
);
const small_button_cn = 'button is-small';
const message_content_container_cn = combineCss(
  message_cn,
  'content-container',
);

const GameOverlayComponent = () => {
  const dispatch = useDispatch();
  const { dimension, game } = useGameContext() ?? {};
  const { pausedScene, contentKey } = useSelector(
    overlaySelectors.selectOverlayState,
  );
  const unlockedFeatures = useSelector(overlaySelectors.selectUnlockedFeatures);
  const content = overlayContentMapping[contentKey ?? ''];

  const handleClose = useCallback(() => {
    if (!game) return;

    game.scene.resume(pausedScene!);
    dispatch(overlayActions.overlayClosed());
    dispatch(gameCmsActions.reset());
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
        case INVENTORY_REACT_EVENT_KEY:
        case QUESTS_REACT_EVENT_KEY:
        case TALENTS_REACT_EVENT_KEY:
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

  const unlocked = unlockedFeatures && unlockedFeatures[content.unlockedKey];

  return (
    <div className={classNames(base_cn, container_cn)}>
      <div
        className={backdrop_cn}
        style={{ height: dimension, width: dimension }}
      >
        <div className={message_container_cn} onClick={handleClose}>
          <div className={message_cn} onClick={handleInnerClick}>
            <div className={message_container_close_button_container_cn}>
              <button
                className={classNames(
                  small_button_cn,
                  message_container_close_button_cn,
                )}
                onClick={handleClose}
              >
                <Icon path={mdiClose} size={1} />
              </button>
            </div>
            <div className={message_content_container_cn}>
              {content.lead && !unlocked && (
                <div>
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
