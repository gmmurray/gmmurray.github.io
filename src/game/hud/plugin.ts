import { DEFAULT_CONFIG, HudConfig } from './config';
import { getGameHeight, getGameWidth } from '../helpers/gameDimensions';

import { HUD_PLUGIN_KEY } from '../constants';

export default class HudPlugin extends Phaser.Plugins.ScenePlugin {
  public config: HudConfig = { ...DEFAULT_CONFIG };
  private _singularTextGameObjects: {
    bottomCenter?: Phaser.GameObjects.Text;
    topLeftPrimary?: Phaser.GameObjects.Text;
    topLeftSecondary?: Phaser.GameObjects.Text;
    topCenter?: Phaser.GameObjects.Text;
    center?: Phaser.GameObjects.Text;
    hpLabel?: Phaser.GameObjects.Text;
    hpValue?: Phaser.GameObjects.Text;
  } = {};

  private _singularGraphicsGameObjects: {
    hpBarValue?: Phaser.GameObjects.Graphics;
    hpBarBackground?: Phaser.GameObjects.Graphics;
  } = {};

  private _multiplicativeTextGameObjects: {
    buffs?: Phaser.GameObjects.Text[];
    debuffs?: Phaser.GameObjects.Text[];
  } = {};

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
    Object.keys(this._singularTextGameObjects).forEach(key => {
      if (this._singularTextGameObjects[key])
        this._singularTextGameObjects[key].shutdown();
    });
  };

  public destroy = () => {
    this.shutdown();
    this.scene = undefined;
  };

  public init = (config?: HudConfig, showHp: boolean = false) => {
    this._setConfig(config)
      ._setTextDisplays()
      ._setHpBarGraphics();

    if (showHp) {
      this._setHpBarBackground()._setHpTextDisplay();
    }
  };

  public updateBottomCenterText = (value?: string) => {
    this._updateBasicText('bottomCenter', value);
  };

  public updateTopLeftText = (primary?: string, secondary?: string) => {
    if (!this._singularTextGameObjects.topLeftPrimary) return;

    if (primary) {
      this._setBasicText('topLeftPrimary', primary);
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
    this._updateBasicText('topCenter', value);
  };

  public updateCenterText = (value?: string) => {
    this._updateBasicText('center', value);
  };

  public addBuffText = (value: string, duration: number) => {
    this._addBuffDebuffText('buffs', value, duration);
  };

  public addDebuffText = (value: string, duration: number) => {
    this._addBuffDebuffText('debuffs', value, duration);
  };

  public updateHpBar = (value: number) => {
    this._updateHpBar(value);
  };

  public updateHpValue = (value?: number) => {
    if (value) {
      this._setHpValue(value);
    } else {
      this._removeHpValue();
    }
  };

  public updateHealth = (value?: number) => {
    if (value) {
      this._updateHpBar(value).updateHpValue(value);
    } else {
      this._removeHpValue();
    }
  };

  private _updateBasicText = (
    key: keyof typeof this._singularTextGameObjects,
    value?: string,
  ) => {
    if (!this._singularTextGameObjects[key]) return;
    if (value) {
      this._setBasicText(key, value);
    } else {
      this._removeBasicText(key);
    }
  };

  private _addBuffDebuffText = (
    type: keyof typeof this._multiplicativeTextGameObjects,
    value: string,
    fadeScrollDuration: number,
  ) => {
    if (!this._multiplicativeTextGameObjects[type]) {
      this._multiplicativeTextGameObjects[type] = [];
    }

    const newTextIndex = this._multiplicativeTextGameObjects[type].length;
    const newText = this._createBuffDebuffTextDisplay(type, value);
    this._multiplicativeTextGameObjects[type].push(newText);

    this._fadeScrollBuffDebuffText(newText, fadeScrollDuration);
    this.scene.time.delayedCall(
      fadeScrollDuration,
      this._removeBuffDebuffText,
      [type, newTextIndex],
      this,
    );
  };

  public textIsDisplayed = (
    key: keyof typeof this._singularTextGameObjects,
  ) => {
    const text = this._singularTextGameObjects[key];
    return text && text.visible && text.text && text.text !== '';
  };

  public updateDimensions = (gameSize: Phaser.Structs.Size) => {
    if (this._singularTextGameObjects.bottomCenter) {
      const newX = gameSize.width / 2;
      const newY = gameSize.height - this.config.texts.bottomCenter.margin;
      this._singularTextGameObjects.bottomCenter.setX(newX).setY(newY);
    }

    if (this._singularTextGameObjects.topCenter) {
      const newX = gameSize.width / 2;
      this._singularTextGameObjects.topCenter.setX(newX);
    }

    if (this._singularTextGameObjects.center) {
      const newXY = gameSize.width / 2;
      const { paddingX, paddingY } = this.config.texts.center;
      this._singularTextGameObjects.center
        .setX(newXY + paddingX)
        .setY(newXY - paddingY);
    }
  };

  private _setConfig = (config?: HudConfig) => {
    if (!config) return this;
    Object.keys(this.config).forEach(key => {
      this.config[key] = config[key] ?? this.config[key];
    });

    return this;
  };

  private _setTextDisplays = () => {
    this._setBottomCenterTextDisplay()
      ._setTopLeftTextDisplay()
      ._setTopCenterTextDisplay()
      ._setCenterTextDisplay();
    return this;
  };

  private _getGameWidth = () => getGameWidth(this.scene);

  private _getGameHeight = () => getGameHeight(this.scene);

  private _setBottomCenterTextDisplay = () => {
    if (this._singularTextGameObjects.bottomCenter)
      this._singularTextGameObjects.bottomCenter.destroy();

    const {
      fontSize,
      fontFamily,
      fontColor,
      depth,
      margin,
    } = this.config.texts.bottomCenter;

    const x = this._getGameWidth() / 2;
    const y = this._getGameHeight() - margin;

    this._singularTextGameObjects.bottomCenter = this.scene.make.text({
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

  private _setTopLeftTextDisplay = () => {
    if (this._singularTextGameObjects.topLeftPrimary)
      this._singularTextGameObjects.topLeftPrimary.destroy();
    if (this._singularTextGameObjects.topLeftSecondary)
      this._singularTextGameObjects.topLeftSecondary.destroy();

    const {
      fontSize,
      fontFamily,
      fontColor,
      depth,
      padding,
    } = this.config.texts.topLeft;

    const xPrimary = padding;
    const yPrimary = padding;

    this._singularTextGameObjects.topLeftPrimary = this.scene.make.text({
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

    this._singularTextGameObjects.topLeftSecondary = this.scene.make.text({
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

  private _setTopCenterTextDisplay = () => {
    if (this._singularTextGameObjects.topCenter)
      this._singularTextGameObjects.topCenter.destroy();

    const {
      fontSize,
      fontFamily,
      fontColor,
      depth,
      padding,
    } = this.config.texts.topCenter;

    const x = this._getGameWidth() / 2;
    const y = padding;

    this._singularTextGameObjects.topCenter = this.scene.make.text({
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

  private _setHpBarGraphics = () => {
    this._singularGraphicsGameObjects.hpBarValue = this.scene.add
      .graphics()
      .setScrollFactor(0);
    this._singularGraphicsGameObjects.hpBarBackground = this.scene.add
      .graphics()
      .setScrollFactor(0);
  };

  private _setHpBarBackground = () => {
    if (!this._singularGraphicsGameObjects.hpBarBackground) return;

    const {
      paddingX,
      paddingY,
      barHeight,
      backgroundColor,
    } = this.config.bars.hp;

    const gameWidth = this._getGameWidth();

    const barWidth = gameWidth / 4;

    this._singularGraphicsGameObjects.hpBarBackground
      .fillStyle(backgroundColor, 1)
      .fillRect(gameWidth - barWidth - paddingX, paddingY, barWidth, barHeight)
      .setDepth(15);

    return this;
  };

  private _updateHpBar = (value: number) => {
    if (!this._singularGraphicsGameObjects.hpBarValue) return;

    const {
      paddingX,
      paddingY,
      barHeight,
      lowColor,
      mediumColor,
      highColor,
    } = this.config.bars.hp;

    const { maxHealth } = this.config;

    const gameWidth = this._getGameWidth();

    const barWidth = gameWidth / 4;

    let barColor: number;
    if (value >= 0.3) {
      barColor = highColor;
    } else if (value >= 0.15) {
      barColor = mediumColor;
    } else {
      barColor = lowColor;
    }

    this._singularGraphicsGameObjects.hpBarValue
      .clear()
      .fillStyle(barColor, 1)
      .fillRect(
        gameWidth - barWidth - paddingX,
        paddingY,
        (barWidth * value) / maxHealth,
        barHeight,
      )
      .setDepth(16);

    return this;
  };

  private _setHpTextDisplay = () => {
    if (this._singularTextGameObjects.hpLabel)
      this._singularTextGameObjects.hpLabel.destroy();

    if (this._singularTextGameObjects.hpValue)
      this._singularTextGameObjects.hpValue.destroy();

    const { hp: hpConfig } = this.config.texts;
    const { hp: barConfig } = this.config.bars;

    const { fontSize, fontFamily, fontColor, depth } = hpConfig.label;

    const { paddingX, paddingY, barHeight } = barConfig;

    const gameWidth = this._getGameWidth();

    const barWidth = gameWidth / 4;

    const y = paddingY + 2 * barHeight;
    const leftX = gameWidth - barWidth - paddingX;
    const rightX = gameWidth - paddingX;

    this._singularTextGameObjects.hpLabel = this.scene.make.text({
      x: leftX,
      y,
      depth,
      text: 'HP',
      visible: true,
      scrollFactor: 0,
      style: {
        color: fontColor,
        fontFamily,
        fontSize: `${fontSize}px`,
      },
      origin: 0,
    });

    this._singularTextGameObjects.hpValue = this.scene.make
      .text({
        x: rightX,
        y,
        depth,
        text: '',
        visible: false,
        scrollFactor: 0,
        style: {
          color: fontColor,
          fontFamily,
          fontSize: `${fontSize}px`,
        },
      })
      .setOrigin(1, 0);

    return this;
  };

  private _setCenterTextDisplay = () => {
    const text = this._singularTextGameObjects.center;
    const textConfig = this.config.texts.center;

    if (text) text.destroy();

    const {
      fontSize,
      fontFamily,
      fontColor,
      depth,
      fontStyle,
      paddingX,
      paddingY,
    } = textConfig;

    const centerXY = this._getGameHeight() / 2;

    const x = centerXY + paddingX;
    const y = centerXY - paddingY;

    this._singularTextGameObjects.center = this.scene.make.text({
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

  private _createBuffDebuffTextDisplay = (
    key: keyof typeof this._multiplicativeTextGameObjects,
    value: string,
  ) => {
    const textConfig = this.config.texts[key];

    const {
      fontSize,
      fontFamily,
      fontColor,
      depth,
      paddingX,
      fontStyle,
      align,
    } = textConfig;

    const centerXY = this._getGameHeight() / 2;

    const x = centerXY + paddingX;
    const y = centerXY;

    return this.scene.make.text({
      x,
      y,
      depth,
      text: value,
      visible: true,
      scrollFactor: 0,
      origin: 0.5,
      style: {
        color: fontColor,
        fontFamily,
        fontSize: `${fontSize}px`,
        align,
        fontStyle,
      },
    });
  };

  private _setTopLeftSecondaryText = (value: string) => {
    if (
      !(
        this._singularTextGameObjects.topLeftPrimary &&
        this._singularTextGameObjects.topLeftSecondary
      )
    )
      return;
    this._singularTextGameObjects.topLeftSecondary
      .setText(value)
      .setVisible(true);
  };

  private _removeTopLeftPrimaryText = () => {
    if (!this._singularTextGameObjects.topLeftPrimary) return;
    this._singularTextGameObjects.topLeftPrimary.setVisible(false).setText('');

    this._removeTopLeftSecondaryText();
  };

  private _removeTopLeftSecondaryText = () => {
    if (
      !(
        this._singularTextGameObjects.topLeftPrimary &&
        this._singularTextGameObjects.topLeftSecondary
      )
    )
      return;
    this._singularTextGameObjects.topLeftSecondary
      .setVisible(false)
      .setText('');
  };

  private _setBasicText = (
    key: keyof typeof this._singularTextGameObjects,
    value: string,
  ) => {
    const text = this._singularTextGameObjects[key];
    if (!text) return;
    text.setText(value).setVisible(true);
  };

  private _removeBasicText = (
    key: keyof typeof this._singularTextGameObjects,
  ) => {
    const text = this._singularTextGameObjects[key];
    if (!text) return;
    text.setVisible(false).setText('');
  };

  private _setHpValue = (value: number) => {
    const text = this._singularTextGameObjects.hpValue;
    if (!text) return;

    const { maxHealth } = this.config;
    text.setText(`${value}/${maxHealth}`).setVisible(true);
  };

  private _removeHpValue = () => {
    const text = this._singularTextGameObjects.hpValue;
    if (!text) return;
    text.setVisible(false).setText('');
  };

  private _fadeScrollText = (
    text: Phaser.GameObjects.Text,
    delay: number,
    duration: number,
  ) => {
    this.scene.time.delayedCall(
      delay,
      () => {
        this._fadeOutText(text, duration)._scrollDownText(text, duration);
      },
      [],
      this,
    );
  };

  private _fadeScrollBuffDebuffText = (
    text: Phaser.GameObjects.Text,
    fadeScrollDuration: number,
  ) => {
    this._fadeScrollText(text, 0, fadeScrollDuration);

    return this;
  };

  private _fadeOutText = (text: Phaser.GameObjects.Text, duration: number) => {
    this.scene.add.tween({
      targets: [text],
      duration,
      ease: 'Linear',
      alpha: 0,
    });

    return this;
  };

  private _scrollDownText = (
    text: Phaser.GameObjects.Text,
    duration: number,
  ) => {
    this.scene.add.tween({
      targets: [text],
      duration,
      ease: 'Linear',
      y: '+=100',
    });

    return this;
  };

  private _removeBuffDebuffText = (
    type: keyof typeof this._multiplicativeTextGameObjects,
    index: number,
  ) => {
    const textRemoved = this._multiplicativeTextGameObjects[type].splice(
      index,
      1,
    );
  };
}
