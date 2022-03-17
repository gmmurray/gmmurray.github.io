import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Game } from 'phaser';
import { TILE_SIZE } from './constants';
import { gameConfig } from './config';
import { getMaxSquareScreenDimension } from './helpers/gameDimensions';
import { useWindowSize } from '../helpers/useWindowSize';

const GameComponent = () => {
  const [game, setGame] = useState<Game | null>(null);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const gameRef = useRef(null);

  useEffect(() => {
    if (game) return;

    const phaserGame = new Game(gameConfig);
    setGame(phaserGame);
  }, [game]);

  const handleResizeEvent = useCallback(() => {
    if (!game) return;
    const dimension = getMaxSquareScreenDimension(
      windowWidth,
      windowHeight,
      TILE_SIZE,
    );
    game.scale.resize(dimension, dimension);
    const canvasEl = (gameRef.current as HTMLDivElement)
      .children[0] as HTMLCanvasElement;
    canvasEl.style.width = `${dimension}px`;
    canvasEl.style.height = `${dimension}px`;
  }, [windowWidth, windowHeight, gameRef]);

  useEffect(() => {
    handleResizeEvent();
  }, [windowWidth, windowHeight]);

  return <div id="game" className="game-container" ref={gameRef}></div>;
};

export default GameComponent;
