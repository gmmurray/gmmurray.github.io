import {
  HUD_INITIALIZED_EVENT,
  UPDATE_HEALTH_EVENT,
  UPDATE_UNLOCKED_FEATURES_EVENT,
} from '../ui/events';
import { UnlockedFeatureCallbacks, UnlockedFeatures } from '../types/savedData';

import HUD from '../ui/hud/hud';
import PhaserTooltip from '../PhaserTooltip/phaserTooltip';
import { Scene } from 'phaser';
import { UIEventEmitter } from '../ui/eventEmitter';
import { UI_SCENE_KEY } from '../constants';

export class UIScene extends Scene {
  public hud: HUD;
  public phaserTooltip: PhaserTooltip;
  private _uiEventEmitter: UIEventEmitter;

  constructor() {
    super(UI_SCENE_KEY);
  }

  public create = (uiEventEmitter: UIEventEmitter) => {
    this._uiEventEmitter = uiEventEmitter;
    this._registerEvents();
  };

  private _updateHealth = (value?: number) => {
    this.hud.updateHealth(value);
  };

  private _initializeHUDHandler = (
    enableBasicText: boolean,
    enableHealthBar: boolean,
    enableUnlockedFeatures: boolean,
    enableBattleText: boolean,
  ) => {
    this.hud = new HUD(this);
    if (enableBasicText) {
      this.hud.enableBasicText();
    }

    if (enableHealthBar) {
      this.hud.enableHealthBar();
    }

    if (enableUnlockedFeatures) {
      this.hud.enableUnlockedFeatures();
    }

    if (enableBattleText) {
      this.hud.enableBattleText();
    }
  };

  private _updateUnlockedFeaturesHandler = (
    features: UnlockedFeatures,
    callbacks: UnlockedFeatureCallbacks,
  ) => {
    this.hud.updateUnlockedFeatures(features, callbacks);
  };

  private _registerEvents = () => {
    this._uiEventEmitter.on(
      HUD_INITIALIZED_EVENT,
      this._initializeHUDHandler,
      this,
    );
    this._uiEventEmitter.on(
      UPDATE_UNLOCKED_FEATURES_EVENT,
      this._updateUnlockedFeaturesHandler,
      this,
    );
    this._uiEventEmitter.on(UPDATE_HEALTH_EVENT, this._updateHealth, this);
  };
}
