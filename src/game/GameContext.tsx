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
import { PLUGIN_KEYS, TILE_SIZE } from './constants';

import { Game } from 'phaser';
import React from 'react';
import { gameConfig } from './config';
import { getMaxSquareScreenDimension } from './helpers/gameDimensions';
import { useLocation } from '@reach/router';
import { useWindowSize } from '../helpers/useWindowSize';

type GameContextType = {
  game: Game | null;
  gameRef: MutableRefObject<any>;
  dimension: number;
};

const GameContext = createContext<GameContextType | null>(null);

export const useGameContext = () => useContext(GameContext);

export const GameContextProvider: FC = ({ children }) => {
  const location = useLocation();
  const [game, setGame] = useState<Game | null>(null);
  const gameRef = useRef(null);
  const [dimension, setDimension] = useState(0);

  const { width: windowWidth, height: windowHeight } = useWindowSize();

  // create a new game instance on load
  useEffect(() => {
    let phaserGame = new Game(gameConfig);
    setGame(phaserGame);
    return () => {
      PLUGIN_KEYS.forEach(key => {
        phaserGame.plugins.removeScenePlugin(key);
      });
      phaserGame.destroy(false, false);
    };
  }, []);

  // handle window/game resizing
  const handleResizeEvent = useCallback(() => {
    if (!game || !windowWidth || !windowHeight) return;
    const sizeDimension = getMaxSquareScreenDimension(
      windowWidth,
      windowHeight,
      TILE_SIZE,
    );
    game.scale.resize(sizeDimension, sizeDimension);
    const canvasEl = ((gameRef.current as unknown) as HTMLDivElement)
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
