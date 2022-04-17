import {
  THEME_NEGATIVE_EFFECT,
  THEME_POSITIVE_EFFECT,
  THEME_WHITE,
} from '../constants';

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

export interface CenterTextConfig extends BasicTextConfig {
  fontStyle: string;
  paddingX: number;
  paddingY: number;
}

export interface BuffDebuffTextConfig extends BasicTextConfig {
  paddingX: number;
  fontStyle: string;
  align: 'right' | 'left';
}

const defaultCenterTextConfig: CenterTextConfig = {
  ...defaultBasicTextConfig,
  fontSize: defaultBasicTextConfig.fontSize * 2,
  fontStyle: 'bold',
  paddingX: 16,
  paddingY: 64,
};

const defaultBuffTextConfig: BuffDebuffTextConfig = {
  ...defaultBasicTextConfig,
  fontColor: THEME_POSITIVE_EFFECT,
  paddingX: 128,
  fontStyle: 'bold',
  align: 'left',
};

const defaultDebuffTextConfig: BuffDebuffTextConfig = {
  ...defaultBasicTextConfig,
  fontColor: THEME_NEGATIVE_EFFECT,
  paddingX: -128,
  fontStyle: 'bold',
  align: 'right',
};

export interface HudConfig {
  texts: {
    bottomCenter?: BasicTextConfig;
    topLeft?: TopTextConfig;
    topCenter?: TopTextConfig;
    center?: CenterTextConfig;
    hp?: {
      label?: TopTextConfig;
      value?: TopTextConfig;
    };
    buffs?: BuffDebuffTextConfig;
    debuffs?: BuffDebuffTextConfig;
  };
}

export const DEFAULT_CONFIG: HudConfig = {
  texts: {
    bottomCenter: {
      ...defaultBasicTextConfig,
    },
    topLeft: {
      ...defaultTopTextConfig,
    },
    topCenter: {
      ...defaultTopTextConfig,
    },
    center: {
      ...defaultCenterTextConfig,
    },
    hp: {
      label: { ...defaultTopTextConfig },
      value: { ...defaultTopTextConfig },
    },
    buffs: {
      ...defaultBuffTextConfig,
    },
    debuffs: {
      ...defaultDebuffTextConfig,
    },
  },
};
