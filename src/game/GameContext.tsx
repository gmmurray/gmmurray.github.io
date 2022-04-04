import {
  FC,
  MutableRefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Game } from 'phaser';
import React from 'react';
import { TILE_SIZE } from './constants';
import { gameConfig } from './config';
import { getMaxSquareScreenDimension } from './helpers/gameDimensions';
import { useWindowSize } from '../helpers/useWindowSize';

type GameContextType = {
  game: Game | null;
  gameRef: MutableRefObject<any>;
  dimension: number;
};

const GameContext = createContext<GameContextType | null>(null);

export const useGameContext = () => useContext(GameContext);

export const GameContextProvider: FC = ({ children }) => {
  const [game, setGame] = useState<Game | null>(null);
  const gameRef = useRef(null);
  const [dimension, setDimension] = useState(0);

  const { width: windowWidth, height: windowHeight } = useWindowSize();

  // create a new game instance on load
  useEffect(() => {
    if (game) return;

    const phaserGame = new Game(gameConfig);
    setGame(phaserGame);
  }, [game]);

  // handle window/game resizing
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
    if (canvasEl) {
      canvasEl.style.width = `${sizeDimension}px`;
      canvasEl.style.height = `${sizeDimension}px`;
    }
    setDimension(sizeDimension);
  }, [windowWidth, windowHeight, gameRef]);

  useEffect(() => {
    handleResizeEvent();
  }, [windowWidth, windowHeight]);

  const value = {
    game,
    gameRef,
    dimension,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
