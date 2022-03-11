import React, { useEffect, useState } from 'react';

import { Game } from 'phaser';
import { gameConfig } from './config';

const GameComponent = () => {
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    if (game) return;

    const phaserGame = new Game(gameConfig);
    setGame(phaserGame);
  }, [game]);

  return <div id="game"></div>;
};

export default GameComponent;
