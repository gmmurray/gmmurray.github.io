import React, { Suspense } from 'react';

import { lazy } from '@loadable/component';

const GameApp = lazy(() => import('../game/GameApp'));

// TODO: fallback component

const GamePage = () => {
  const isSSR = typeof window === 'undefined';
  return (
    <div className="game-page">
      <h1>game page</h1>
      {!isSSR && (
        <Suspense fallback={<div>loading...</div>}>
          <GameApp />
        </Suspense>
      )}
    </div>
  );
};

export default GamePage;
