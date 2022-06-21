import GameOverlayComponent from './GameOverlay/GameOverlayComponent';
import React from 'react';
import { overlaySelectors } from './redux/overlaySlice';
import { useGameContext } from './GameContext';
import { useSelector } from 'react-redux';

const GameComponent = () => {
  const isOverlayOpen = useSelector(overlaySelectors.selectOverlayOpen);
  const { gameRef } = useGameContext() ?? {};

  return (
    <div id="game" className="game-container" ref={gameRef}>
      {isOverlayOpen && <GameOverlayComponent />}
    </div>
  );
};

export default GameComponent;
