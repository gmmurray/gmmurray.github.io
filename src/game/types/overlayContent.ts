import { FC } from 'react';

export enum OverlayContentKey {
  SKILLS,
  UF,
  UNF,
  BIO,
}

export interface OverlayContent {
  lead: string;
  component?: JSX.Element;
}

export interface OverlayContentMap {
  [key: number]: OverlayContent;
}
