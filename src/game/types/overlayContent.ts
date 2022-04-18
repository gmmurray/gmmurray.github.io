import { FC } from 'react';

export enum OverlayContentKey {
  SKILLS,
  UF,
  UNF,
  BIO,
  EXPERIENCES,
  FEATURED_PROJECTS,
}

export interface OverlayContent {
  lead: string;
  component?: JSX.Element;
}

export interface OverlayContentMap {
  [key: number]: OverlayContent;
}
