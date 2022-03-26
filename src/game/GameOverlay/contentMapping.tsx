import { OverlayContentKey, OverlayContentMap } from '../types/overlayContent';

import Diploma from './Diploma';
import React from 'react';

export const overlayContentMapping: OverlayContentMap = {
  [OverlayContentKey.UF]: {
    lead: `bachelor's of anthropology from the university of florida '18`,
    component: <Diploma key={OverlayContentKey.UF} />,
  },
  [OverlayContentKey.UNF]: {
    lead: `bachelor's of computing and information sciences from the university of north florida '20`,
  },
  [OverlayContentKey.SKILLS]: {
    lead: `The PC battlestation turns on, accessing Greg's secret skills files...`,
  },
  [OverlayContentKey.BIO]: {
    lead: 'You seemed to have stumbled across an autobiography of sorts...',
  },
};
