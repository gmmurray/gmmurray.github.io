import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { GameCmsContent } from '../types/cmsContent';
import { StateSelector } from '../types/redux';
import cloneDeep from 'lodash.clonedeep';

type GameCmsState = {
  data: GameCmsContent;
};

const initialState: GameCmsState = {
  data: null,
};

export const gameCmsSlice = createSlice({
  name: 'gameCms',
  initialState,
  reducers: {
    dataLoaded: (state, action: PayloadAction<GameCmsContent>) => ({
      ...state,
      data: cloneDeep({ ...action.payload }),
    }),
  },
});

const { actions, reducer } = gameCmsSlice;

const selectGameCmsState: StateSelector<GameCmsState> = state => state.gameCms;

const selectGameCmsData: StateSelector<GameCmsState['data']> = state =>
  selectGameCmsState(state).data;

export const gameCmsActions = actions;
export const gameCmsReducer = reducer;
export const gameCmsSelectors = {
  selectGameCmsData,
};
