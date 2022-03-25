import React, { FC } from 'react';

import Icon from '@mdi/react';
import { Typewriter } from 'react-simple-typewriter';
import { mdiClose } from '@mdi/js';

type GameOverlayComponentProps = {
  responsiveDimension: number;
  onClose: () => void;
};

const GameOverlayComponent: FC<GameOverlayComponentProps> = ({
  responsiveDimension,
  onClose,
}) => {
  return (
    <div className="game-overlay game-overlay-container">
      <div
        className="game-overlay-backdrop"
        style={{ height: responsiveDimension, width: responsiveDimension }}
      >
        <div className="game-overlay-message-container" onClick={onClose}>
          <div
            className="game-overlay-message"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <div className="close-button-container">
              <button
                className="button is-small"
                onClick={e => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                <Icon path={mdiClose} size={1} />
              </button>
            </div>
            <div className="main-container">
              <div className="lead-section">
                <Typewriter words={['hello whats up']} typeSpeed={50} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverlayComponent;
