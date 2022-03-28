import { OverlayContentKey, OverlayContentMap } from '../types/overlayContent';

import { GameCmsContent } from '../types/cmsContent';
import React from 'react';
import { gameCmsSelectors } from '../redux/gameCmsSlice';
import { overlaySelectors } from '../redux/overlaySlice';
import { useSelector } from 'react-redux';

const getDataPiece = (
  key: OverlayContentKey,
  data: GameCmsContent,
): string[] => {
  switch (key) {
    case OverlayContentKey.SKILLS:
      return data.technologyContent.items;
    default:
      throw new Error('key not supported');
  }
};

const SimpleList = () => {
  const currentKey = useSelector(overlaySelectors.selectOverlayContentKey);
  const cmsContent = useSelector(gameCmsSelectors.selectGameCmsData);
  const data = getDataPiece(currentKey, cmsContent);
  console.log(data);
  return <div className="game-overlay-component-container">SimpleList</div>;
};

export default SimpleList;
