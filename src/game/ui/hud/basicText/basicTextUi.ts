import { BasicTextUIConfig } from '../../../types/hud/basicText';
import { Scene } from 'phaser';
import { defaultBasicTextUIConfig } from './config';
import { mergeWithDefault } from '../../../helpers/mergeWithDefault';

export default class BasicTextUI {
  private _bottomCenter: Phaser.GameObjects.Text;
  private _topLeftPrimary: Phaser.GameObjects.Text;
  private _topLeftSecondary: Phaser.GameObjects.Text;
  private _topCenter: Phaser.GameObjects.Text;
  private _center: Phaser.GameObjects.Text;

  private _scene: Scene;
  private _config: BasicTextUIConfig;

  constructor(scene: Scene, config?: BasicTextUIConfig) {
    this._config = mergeWithDefault(defaultBasicTextUIConfig, config);
    this._scene = scene;
    Object.keys(this._config).forEach(key => {
      this._setTextDisplay(key as keyof BasicTextUIConfig, this._config);
    });
  }

  public shutdown = () => {
    if (this._bottomCenter) this._bottomCenter.destroy();
    if (this._topLeftPrimary) this._topLeftPrimary.destroy();
    if (this._topLeftSecondary) this._topLeftSecondary.destroy();
    if (this._topCenter) this._topCenter.destroy();
    if (this._center) this._center.destroy();
  };

  public updateBottomCenterText = (value?: string) => {
    this._updateText(this._bottomCenter, value);
  };

  public updateTopCenterText = (value?: string) => {
    this._updateText(this._topCenter, value);
  };

  public updateCenterText = (value?: string) => {
    this._updateText(this._center, value);
  };

  public updateTopLeftText = (primary?: string, secondary?: string) => {
    if (!this._topLeftPrimary.text) return;

    if (primary) {
      this._updateText(this._topLeftPrimary, primary);

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

  private _setTextDisplay = (
    key: keyof BasicTextUIConfig,
    config: BasicTextUIConfig,
  ) => {
    if (key === 'bottomCenter') {
      this._setBottomCenterTextDisplay(config.bottomCenter);
    } else if (key === 'center') {
      this._setCenterTextDisplay(config.center);
    } else if (key === 'topCenter') {
      this._setTopCenterTextDisplay(config.topCenter);
    } else if (key === 'topLeft') {
      this._setTopLeftTextDisplay(config.topLeft);
    }
  };

  private _setBottomCenterTextDisplay = (
    config: BasicTextUIConfig['bottomCenter'],
  ) => {
    if (this._bottomCenter) this._bottomCenter.destroy();

    const { fontSize, fontFamily, fontColor, depth, margin } = config;

    const x = this._getGameWidth() / 2;
    const y = this._getGameHeight() - margin;

    this._bottomCenter = this._scene.make.text({
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

    return this;
  };

  private _setCenterTextDisplay = (config: BasicTextUIConfig['center']) => {
    const text = this._center;

    if (text) text.destroy();

    const {
      fontSize,
      fontFamily,
      fontColor,
      depth,
      fontStyle,
      paddingX,
      paddingY,
    } = config;

    const centerXY = this._getGameHeight() / 2;

    const x = centerXY + paddingX;
    const y = centerXY - paddingY;

    this._center = this._scene.make.text({
      x,
      y,
      depth,
      text: '',
      visible: false,
      scrollFactor: 0,
      origin: 0.5,
      style: {
        color: fontColor,
        fontFamily,
        fontSize: `${fontSize}px`,
        fontStyle,
      },
    });

    return this;
  };

  private _setTopCenterTextDisplay = (
    config: BasicTextUIConfig['topCenter'],
  ) => {
    if (this._topCenter) this._topCenter.destroy();

    const { fontSize, fontFamily, fontColor, depth, padding } = config;

    const x = this._getGameWidth() / 2;
    const y = padding;

    this._topCenter = this._scene.make.text({
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

    return this;
  };

  private _setTopLeftTextDisplay = (config: BasicTextUIConfig['topLeft']) => {
    if (this._topLeftPrimary) this._topLeftPrimary.destroy();
    if (this._topLeftSecondary) this._topLeftSecondary.destroy();

    const { fontSize, fontFamily, fontColor, depth, padding } = config;

    const xPrimary = padding;
    const yPrimary = padding;

    this._topLeftPrimary = this._scene.make.text({
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

    this._topLeftSecondary = this._scene.make.text({
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

    return this;
  };

  private _updateText = (text: Phaser.GameObjects.Text, value?: string) => {
    if (!text) return;
    if (value !== undefined) {
      this._setText(text, value);
    } else {
      this._removeText(text);
    }
  };

  private _setText = (text: Phaser.GameObjects.Text, value: string) => {
    text.setText(value).setVisible(true);
  };

  private _removeText = (text: Phaser.GameObjects.Text) => {
    text.setText('').setVisible(false);
  };

  private _setTopLeftSecondaryText = (value: string) => {
    if (!(this._topLeftPrimary.text && this._topLeftSecondary.text)) return;
    this._topLeftSecondary.setText(value).setVisible(true);
  };

  private _removeTopLeftPrimaryText = () => {
    if (!this._topLeftPrimary.text) return;
    this._topLeftPrimary.setVisible(false).setText('');

    this._removeTopLeftSecondaryText();
  };

  private _removeTopLeftSecondaryText = () => {
    if (!(this._topLeftPrimary.text && this._topLeftSecondary.text)) return;
    this._topLeftSecondary.setVisible(false).setText('');
  };

  private _getGameWidth = () => this._scene.cameras.main.worldView.width;
  private _getGameHeight = () => this._scene.cameras.main.worldView.height;
}
