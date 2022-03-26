import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { OverlayContentKey } from '../types/overlayContent';
import { StateSelector } from '../types/redux';

type OverlayState = {
  open: boolean;
  contentKey: OverlayContentKey | null;
  pausedScene: string;
};

const initialState: OverlayState = {
  open: false,
  contentKey: null,
  pausedScene: null,
};

export const overlaySlice = createSlice({
  name: 'overlay',
  initialState,
  reducers: {
    overlayOpened: (
      state,
      {
        payload: { contentKey, pausedScene },
      }: PayloadAction<{ contentKey: OverlayContentKey; pausedScene: string }>,
    ) => ({
      ...state,
      contentKey,
      open: true,
      pausedScene,
    }),
    overlayClosed: state => ({
      ...state,
      open: initialState.open,
      contentKey: initialState.contentKey,
      pausedScene: initialState.pausedScene,
    }),
  },
});

const { actions, reducer } = overlaySlice;

export const overlayActions = actions;
export const overlayReducer = reducer;

const selectOverlayState: StateSelector<OverlayState> = state => state.overlay;

const selectOverlayOpen: StateSelector<OverlayState['open']> = state =>
  selectOverlayState(state).open;

const selectOverlayContent: StateSelector<OverlayState['contentKey']> = state =>
  selectOverlayState(state).contentKey;

const selectPausedScene: StateSelector<OverlayState['pausedScene']> = state =>
  selectOverlayState(state).pausedScene;

export const overlaySelectors = {
  selectOverlayState,
  selectOverlayOpen,
  selectOverlayContent,
  selectPausedScene,
};
