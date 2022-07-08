import {
  assetCredits,
  guideCredits,
} from '../game/helpers/creditsSceneContent';

import React from 'react';

const GameCreditsPage = () => {
  return (
    <div className="credits-page">
      <a href="/">Home</a>
      <h1>Credits</h1>
      <h2>Guides</h2>
      {guideCredits.map((gc, index) => (
        <div key={index} className="credits-page__item">
          <a href={gc.link} target="_blank" rel="noopener noreferrer">
            {gc.name}
          </a>
        </div>
      ))}
      <h2>Assets</h2>
      {assetCredits.map((ac, index) => (
        <div key={index} className="credits-page__item">
          <a href={ac.link}>{ac.name}</a>
        </div>
      ))}
    </div>
  );
};

export default GameCreditsPage;
