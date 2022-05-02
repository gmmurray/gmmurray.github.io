import { LOCAL_STORAGE_KEY } from '../constants';
import { UnlockedFeatures } from '../types/savedData';

export const loadAllSavedData = (): Record<string, any> | null =>
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? null;

export function loadLevelSavedData<T>(): T | null {
  const save = loadAllSavedData();
  return save && save[this.scene.key] ? (save[this.scene.key] as T) : null;
}

export function saveLevelData<T>(data: T, sceneKey: string) {
  const current = loadAllSavedData() ?? {};
  const value = {
    ...current,
    [sceneKey]: {
      ...current[sceneKey],
      ...data,
    },
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
}

export const updateUnlockedFeatures = (unlockedFeatures: UnlockedFeatures) => {
  const current = loadAllSavedData() ?? {};

  const newValue = {
    ...current,
    unlockedFeatures: {
      ...current.unlockedFeatures,
      ...unlockedFeatures,
    },
  };

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newValue));
};

export const loadUnlockedFeatures = () =>
  (loadAllSavedData() ?? {}).unlockedFeatures;
