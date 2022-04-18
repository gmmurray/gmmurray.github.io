import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { GameCmsContent } from '../types/cmsContent';
import { StateSelector } from '../types/redux';
import cloneDeep from 'lodash.clonedeep';

type GameCmsState = {
  data: GameCmsContent;
  selectedTalentTree: number;
  selectedQuestTab: 0 | 1 | 2;
  selectedQuest: number;
};

const initialState: GameCmsState = {
  data: null,
  selectedTalentTree: 0,
  selectedQuestTab: 0,
  selectedQuest: 0,
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
    selectedQuestTabChanged: (state, action: PayloadAction<0 | 1 | 2>) => ({
      ...state,
      selectedQuestTab: action.payload,
    }),
    selectedQuestChanged: (state, action: PayloadAction<number>) => ({
      ...state,
      selectedQuest: action.payload,
    }),
    reset: state => ({ ...initialState, data: state.data }),
  },
});

const { actions, reducer } = gameCmsSlice;

const selectGameCmsState: StateSelector<GameCmsState> = state => state.gameCms;

const selectGameCmsData: StateSelector<GameCmsState['data']> = state =>
  selectGameCmsState(state).data;

const selectGameCmsAboutContent: StateSelector<GameCmsState['data']['aboutContent']> = state =>
  selectGameCmsData(state).aboutContent;

const selectSelectedTalentTree: StateSelector<GameCmsState['selectedTalentTree']> = state =>
  selectGameCmsState(state).selectedTalentTree;

const selectGameCmsExperiencesContent: StateSelector<GameCmsState['data']['experiencesContent']> = state =>
  selectGameCmsState(state).data.experiencesContent;

const selectGameCmsSelectedQuestTab: StateSelector<GameCmsState['selectedQuestTab']> = state =>
  selectGameCmsState(state).selectedQuestTab;

const selectGameCmsSelectedQuest: StateSelector<GameCmsState['selectedQuest']> = state =>
  selectGameCmsState(state).selectedQuest;

export const gameCmsActions = actions;
export const gameCmsReducer = reducer;
export const gameCmsSelectors = {
  selectGameCmsData,
  selectGameCmsAboutContent,
  selectSelectedTalentTree,
  selectGameCmsExperiencesContent,
  selectGameCmsSelectedQuestTab,
  selectGameCmsSelectedQuest,
};
