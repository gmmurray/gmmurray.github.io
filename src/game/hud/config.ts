import { THEME_WHITE } from '../constants';

export interface BasicTextConfig {
  margin?: number;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  depth?: number;
}

const defaultBasicTextConfig: BasicTextConfig = {
  margin: 25,
  fontSize: 18,
  fontFamily: 'Monospace',
  fontColor: THEME_WHITE,
  depth: 49,
};

export interface TopTextConfig extends BasicTextConfig {
  padding?: number;
}

const defaultTopTextConfig: TopTextConfig = {
  ...defaultBasicTextConfig,
  padding: 32,
};

export interface HudConfig {
  texts: {
    bottomCenterText?: BasicTextConfig;
    topLeftText?: TopTextConfig;
    topCenterText?: TopTextConfig;
  };
}

export const DEFAULT_CONFIG: HudConfig = {
  texts: {
    bottomCenterText: {
      ...defaultBasicTextConfig,
    },
    topLeftText: {
      ...defaultTopTextConfig,
    },
    topCenterText: {
      ...defaultTopTextConfig,
    },
  },
};
