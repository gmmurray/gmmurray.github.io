import { FC } from 'react';

export enum OverlayContentKey {
  SKILLS,
  UF,
  UNF,
  BIO,
  EXPERIENCES,
}

export interface OverlayContent {
  lead: string;
  component?: JSX.Element;
}

export interface OverlayContentMap {
  [key: number]: OverlayContent;
}
