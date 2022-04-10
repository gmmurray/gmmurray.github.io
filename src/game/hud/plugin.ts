import { DEFAULT_CONFIG, HudConfig } from './config';
import { getGameHeight, getGameWidth } from '../helpers/gameDimensions';

import { HUD_PLUGIN_KEY } from '../constants';

export default class HudPlugin extends Phaser.Plugins.ScenePlugin {
  public config: HudConfig = { ...DEFAULT_CONFIG };
  private _bottomCenterText: Phaser.GameObjects.Text;
  private _topLeftPrimaryText: Phaser.GameObjects.Text;
  private _topLeftSecondaryText: Phaser.GameObjects.Text;
  private _topCenterText: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Plugins.ScenePlugin['scene'],
    pluginManager: Phaser.Plugins.PluginManager,
  ) {
    super(scene, pluginManager, HUD_PLUGIN_KEY);
    this.scene = scene;
  }

  public boot = () => {
    const eventEmitter = this.systems.events;

    eventEmitter.on('shutdown', this.shutdown, this);
    eventEmitter.on('destroy', this.destroy, this);
  };

  public shutdown = () => {
    if (this._bottomCenterText) this._bottomCenterText.destroy();
    if (this._topLeftPrimaryText) this._topLeftPrimaryText.destroy();
    if (this._topLeftSecondaryText) this._topLeftSecondaryText.destroy();
    if (this._topCenterText) this._topCenterText.destroy();
  };

  public destroy = () => {
    this.shutdown();
    this.scene = undefined;
  };

  public init = (config?: HudConfig) => {
    this._setConfig(config);
    this._setBottomCenterTextDisplay();
    this._setTopLeftTextDisplay();
    this._setTopCenterTextDisplay();
  };

  public updateBottomCenterText = (value?: string) => {
    if (!this._bottomCenterText) return;
    if (value) {
      this._setBottomCenterText(value);
    } else {
      this._removeBottomCenterText();
    }
  };

  public updateTopLeftText = (primary?: string, secondary?: string) => {
    if (!this._topLeftPrimaryText) return;

    if (primary) {
      this._setTopLeftPrimaryText(primary);
      if (secondary) {
        this._setTopLeftSecondaryText(secondary);
      } else {
        this._removeTopLeftSecondaryText();
      }
    } else {
      this._removeTopLeftPrimaryText();
      this._removeTopLeftSecondaryText();
    }
  };

  public updateTopCenterText = (value?: string) => {
    if (!this._topCenterText) return;
    if (value) {
      this._setTopCenterText(value);
    } else {
      this._removeTopCenterText();
    }
  };

  public bottomCenterTextIsDisplayed = () =>
    this._bottomCenterText &&
    this._bottomCenterText.visible &&
    this._bottomCenterText.text &&
    this._bottomCenterText.text !== '';

  public topLeftTextIsDisplayed = () =>
    this._topLeftPrimaryText &&
    this._topLeftPrimaryText.visible &&
    this._topLeftPrimaryText.text &&
    this._topLeftPrimaryText.text !== '';

  public topCenterTextIsDisplayed = () =>
    this._topCenterText &&
    this._topCenterText.visible &&
    this._topCenterText.text &&
    this._topCenterText.text !== '';

  public updateDimensions = (gameSize: Phaser.Structs.Size) => {
    if (this._bottomCenterText) {
      const newX = gameSize.width / 2;
      const newY = gameSize.height - this.config.texts.bottomCenterText.margin;
      this._bottomCenterText.setX(newX);
      this._bottomCenterText.setY(newY);
    }

    if (this._topCenterText) {
      const newX = gameSize.width / 2;
      this._topCenterText.setX(newX);
    }
  };

  private _setConfig = (config?: HudConfig) => {
    if (!config) return this;
    Object.keys(this.config).forEach(key => {
      this.config[key] = config[key] ?? this.config[key];
    });

    return this;
  };

  private _getGameWidth = () => getGameWidth(this.scene);

  private _getGameHeight = () => getGameHeight(this.scene);

  private _setBottomCenterTextDisplay = () => {
    if (this._bottomCenterText) this._bottomCenterText.destroy();

    const {
      fontSize,
      fontFamily,
      fontColor,
      depth,
      margin,
    } = this.config.texts.bottomCenterText;

    const x = this._getGameWidth() / 2;
    const y = this._getGameHeight() - margin;

    this._bottomCenterText = this.scene.make.text({
      x,
      y,
      depth,
      text: '',
      style: {
        color: fontColor,
        fontFamily,
        fontSize: `${fontSize}px`,
      },
      visible: false,
      scrollFactor: 0,
      origin: 0.5,
    });
  };

  private _setTopLeftTextDisplay = () => {
    if (this._topLeftPrimaryText) this._topLeftPrimaryText.destroy();
    if (this._topLeftSecondaryText) this._topLeftSecondaryText.destroy();

    const {
      fontSize,
      fontFamily,
      fontColor,
      depth,
      padding,
    } = this.config.texts.topLeftText;

    const xPrimary = padding;
    const yPrimary = padding;

    this._topLeftPrimaryText = this.scene.make.text({
      x: xPrimary,
      y: yPrimary,
      depth,
      text: '',
      style: {
        color: fontColor,
        fontFamily,
        fontSize: `${fontSize}px`,
      },
      visible: false,
      scrollFactor: 0,
    });

    this._topLeftSecondaryText = this.scene.make.text({
      x: xPrimary,
      y: yPrimary + fontSize + 10,
      depth,
      text: '',
      style: {
        color: fontColor,
        fontFamily,
        fontSize: `${fontSize}px`,
      },
      visible: false,
      scrollFactor: 0,
    });
  };

  private _setTopCenterTextDisplay = () => {
    if (this._topCenterText) this._topCenterText.destroy();

    const {
      fontSize,
      fontFamily,
      fontColor,
      depth,
      padding,
    } = this.config.texts.topCenterText;

    const x = this._getGameWidth() / 2;
    const y = padding;

    this._topCenterText = this.scene.make.text({
      x,
      y,
      depth,
      text: '',
      style: {
        color: fontColor,
        fontFamily,
        fontSize: `${fontSize}px`,
      },
      visible: false,
      scrollFactor: 0,
      origin: 0.5,
    });
  };

  private _setBottomCenterText = (value: string) => {
    if (!this._bottomCenterText) return;
    this._bottomCenterText.setText(value).setVisible(true);
  };

  private _removeBottomCenterText = () => {
    this._bottomCenterText.setVisible(false).setText('');
  };

  private _setTopLeftPrimaryText = (value: string) => {
    if (!this._topLeftPrimaryText) return;
    this._topLeftPrimaryText.setText(value).setVisible(true);
  };

  private _setTopLeftSecondaryText = (value: string) => {
    if (!(this._topLeftPrimaryText && this._topLeftSecondaryText)) return;
    this._topLeftSecondaryText.setText(value).setVisible(true);
  };

  private _removeTopLeftPrimaryText = () => {
    if (!this._topLeftPrimaryText) return;
    this._topLeftPrimaryText.setVisible(false).setText('');

    this._removeTopLeftSecondaryText();
  };

  private _removeTopLeftSecondaryText = () => {
    if (!(this._topLeftPrimaryText && this._topLeftSecondaryText)) return;
    this._topLeftSecondaryText.setVisible(false).setText('');
  };

  private _setTopCenterText = (value: string) => {
    if (!this._topCenterText) return;
    this._topCenterText.setText(value).setVisible(true);
  };

  private _removeTopCenterText = () => {
    if (!this._topCenterText) return;
    this._topCenterText.setVisible(false).setText('');
  };
}
