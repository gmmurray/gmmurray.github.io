import { RootState } from '../redux/store';

export type StateSelector<T> = (state: RootState) => T;
