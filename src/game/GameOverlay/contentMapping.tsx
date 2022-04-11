import { OverlayContentKey, OverlayContentMap } from '../types/overlayContent';

import Diploma from './Diploma';
import React from 'react';
import SimpleText from './SimpleText';
import TechTalentTree from './talentTree/TechTalentTree';

export const overlayContentMapping: OverlayContentMap = {
  [OverlayContentKey.UF]: {
    lead: `You find a scroll hidden behind the trophy...`,
    component: <Diploma />,
  },
  [OverlayContentKey.UNF]: {
    lead: `You find a scroll hidden behind the medal...`,
    component: <Diploma />,
  },
  [OverlayContentKey.SKILLS]: {
    lead: `The PC battlestation turns on, accessing Greg's secret RPG talent trees...`,
    component: <TechTalentTree />,
  },
  [OverlayContentKey.BIO]: {
    lead: 'You seem to have stumbled across an autobiography of sorts...',
    component: <SimpleText />,
  },
  [OverlayContentKey.EXPERIENCES]: {
    lead: `Inside the chest is a glimpse into Greg's experiences...`,
  },
};
