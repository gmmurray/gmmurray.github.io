import React, { FC } from 'react';

import { OverlayContentKey } from '../types/overlayContent';
import { useGameContext } from '../GameContext';

const IMAGE_SRC = '/assets/game/images/paper_scroll.png';

type DiplomaProps = {
  key: OverlayContentKey;
};

const Diploma: FC<DiplomaProps> = ({ key }) => {
  const { dimension } = useGameContext();
  const name =
    key === OverlayContentKey.UF
      ? 'university of florida'
      : 'university of north florida';
  return (
    <div className="diploma-container">
      <img
        src={IMAGE_SRC}
        className="diploma"
        style={{ height: dimension / 2 }}
      />
      <div className="diploma-content">{name}</div>
    </div>
  );
};

export default Diploma;
