import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { GameCmsContent } from '../types/cmsContent';
import { StateSelector } from '../types/redux';
import cloneDeep from 'lodash.clonedeep';

type GameCmsState = {
  data: GameCmsContent;
  selectedTalentTree: number;
};

const initialState: GameCmsState = {
  data: null,
  selectedTalentTree: 0,
};

export const gameCmsSlice = createSlice({
  name: 'gameCms',
  initialState,
  reducers: {
    dataLoaded: (state, action: PayloadAction<GameCmsContent>) => ({
      ...state,
      data: cloneDeep({ ...action.payload }),
    }),
    selectedTalentTreeChanged: (state, action: PayloadAction<number>) => ({
      ...state,
      selectedTalentTree: action.payload,
    }),
  },
});

const { actions, reducer } = gameCmsSlice;

const selectGameCmsState: StateSelector<GameCmsState> = state => state.gameCms;

const selectGameCmsData: StateSelector<GameCmsState['data']> = state =>
  selectGameCmsState(state).data;

const selectSelectedTalentTree: StateSelector<GameCmsState['selectedTalentTree']> = state =>
  selectGameCmsState(state).selectedTalentTree;

export const gameCmsActions = actions;
export const gameCmsReducer = reducer;
export const gameCmsSelectors = {
  selectGameCmsData,
  selectSelectedTalentTree,
};
