import './gameStyles.scss';

import GameComponent from './GameComponent';
import { GameContextProvider } from './GameContext';
import { Provider } from 'react-redux';
import React from 'react';
import { store } from './redux/store';

const GameApp = () => (
  <Provider store={store}>
    <GameContextProvider>
      <GameComponent />
    </GameContextProvider>
  </Provider>
);

export default GameApp;
