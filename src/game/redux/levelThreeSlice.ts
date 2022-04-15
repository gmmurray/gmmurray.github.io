import {
  LevelThreeDifficulty,
  LevelThreeDifficultySettings,
  LevelThreeFireType,
} from '../types/levelThree';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Coordinates } from '../types/position';
import { StateSelector } from '../types/redux';
import { levelThreeDifficultySettingsMap } from '../cast/levelThree';

export type LevelThreeState = {
  orbs: {
    1: boolean;
    2: boolean;
    3: boolean;
  };
  health: number;
  difficultySettings: LevelThreeDifficultySettings;
  activeFires: {
    [LevelThreeFireType.COLUMN]: boolean;
    [LevelThreeFireType.EXPLOSION]: boolean;
  };
  standingInFire?: Coordinates;
};

const initialState: LevelThreeState = {
  orbs: {
    1: false,
    2: false,
    3: false,
  },
  health: 100,
  difficultySettings: {
    ...levelThreeDifficultySettingsMap[LevelThreeDifficulty.EASY],
  },
  activeFires: {
    [LevelThreeFireType.COLUMN]: false,
    [LevelThreeFireType.EXPLOSION]: false,
  },
  standingInFire: undefined,
};

export const levelThreeSlice = createSlice({
  name: 'levelThree',
  initialState,
  reducers: {
    healthChanged: (state, action: PayloadAction<number>) => ({
      ...state,
      health: changeHealth(state.health, action.payload),
    }),
    orbCollected: (state, action: PayloadAction<1 | 2 | 3>) => ({
      ...state,
      orbs: {
        ...state.orbs,
        [action.payload]: true,
      },
    }),
    activeFiresChanged: (
      state,
      action: PayloadAction<{ active: boolean; type: LevelThreeFireType }>,
    ) => ({
      ...state,
      activeFires: {
        ...state.activeFires,
        [action.payload.type]: action.payload.active,
      },
    }),
    standingInFireChanged: (state, action: PayloadAction<Coordinates>) => ({
      ...state,
      standingInFire: action.payload
        ? {
            ...state.standingInFire,
            ...action.payload,
          }
        : undefined,
    }),
  },
});

const { actions, reducer } = levelThreeSlice;

const selectLevelThreeState: StateSelector<LevelThreeState> = state =>
  state.levelThree;
const selectLevelThreeHealth: StateSelector<LevelThreeState['health']> = state =>
  selectLevelThreeState(state).health;
const selectLevelThreeDifficultySettings: StateSelector<LevelThreeState['difficultySettings']> = state =>
  selectLevelThreeState(state).difficultySettings;
const selectLevelThreeOrbs: StateSelector<LevelThreeState['orbs']> = state =>
  selectLevelThreeState(state).orbs;
const selectLevelThreeStandingInFire: StateSelector<LevelThreeState['standingInFire']> = state =>
  selectLevelThreeState(state).standingInFire;
const selectLevelThreeActiveFires: StateSelector<LevelThreeState['activeFires']> = state =>
  selectLevelThreeState(state).activeFires;

export const levelThreeActions = actions;
export const levelThreeReducer = reducer;
export const levelThreeSelectors = {
  selectLevelThreeHealth,
  selectLevelThreeDifficultySettings,
  selectLevelThreeOrbs,
  selectLevelThreeStandingInFire,
  selectLevelThreeActiveFires,
};

const changeHealth = (currHealth: number, changeValue: number) => {
  const newValue = currHealth + changeValue;
  if (newValue >= 100) {
    return 100;
  } else if (newValue <= 0) {
    return 0;
  } else {
    return newValue;
  }
};
