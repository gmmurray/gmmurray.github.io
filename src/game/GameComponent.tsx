import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Game } from 'phaser';
import GameOverlayComponent from './GameOverlay/GameOverlayComponent';
import { TILE_SIZE } from './constants';
import { gameConfig } from './config';
import { getMaxSquareScreenDimension } from './helpers/gameDimensions';
import { useWindowSize } from '../helpers/useWindowSize';

const GameComponent = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [dimension, setDimension] = useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const gameRef = useRef(null);

  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (game) return;

    const phaserGame = new Game(gameConfig);
    setGame(phaserGame);
  }, [game]);

  const handleResizeEvent = useCallback(() => {
    if (!game) return;
    const sizeDimension = getMaxSquareScreenDimension(
      windowWidth,
      windowHeight,
      TILE_SIZE,
    );
    game.scale.resize(sizeDimension, sizeDimension);
    const canvasEl = (gameRef.current as HTMLDivElement)
      .children[0] as HTMLCanvasElement;
    canvasEl.style.width = `${sizeDimension}px`;
    canvasEl.style.height = `${sizeDimension}px`;
    setDimension(sizeDimension);
  }, [windowWidth, windowHeight, gameRef]);

  useEffect(() => {
    handleResizeEvent();
  }, [windowWidth, windowHeight]);

  return (
    <div id="game" className="game-container" ref={gameRef}>
      {open && <GameOverlayComponent responsiveDimension={dimension} onClose={() => setOpen(false)}/>}
    </div>
  );
};

export default GameComponent;
