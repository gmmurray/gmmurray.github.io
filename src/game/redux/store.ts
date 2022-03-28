import { configureStore } from '@reduxjs/toolkit';
import { gameCmsReducer } from './gameCmsSlice';
import { overlayReducer } from './overlaySlice';

export const store = configureStore({
  reducer: {
    overlay: overlayReducer,
    gameCms: gameCmsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
