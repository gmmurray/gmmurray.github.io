import './gameStyles.scss';

import React, { FC, useEffect } from 'react';

import { GameCmsContent } from './types/cmsContent';
import GameComponent from './GameComponent';
import { GameContextProvider } from './GameContext';
import { Provider } from 'react-redux';
import { gameCmsActions } from './redux/gameCmsSlice';
import { store } from './redux/store';

type GameAppProps = {
  cmsContent: GameCmsContent;
};

const GameApp: FC<GameAppProps> = ({ cmsContent }) => {
  useEffect(() => {
    if (cmsContent) {
      const content = {};
      const classKeys = Object.keys(new GameCmsContent());

      classKeys.forEach(key => {
        content[key] = cmsContent[key];
      });

      store.dispatch(gameCmsActions.dataLoaded(content as GameCmsContent));
    }
  }, []);

  return (
    // @ts-ignore
    <Provider store={store}>
      <GameContextProvider>
        <GameComponent />
      </GameContextProvider>
    </Provider>
  );
};

export default GameApp;
