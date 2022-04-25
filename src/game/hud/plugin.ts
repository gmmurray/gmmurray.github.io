import { AnyCallback, noop } from '../types/callback';
import {
  DEFAULT_CONFIG,
  FeatureSpriteConfig,
  FeatureTextConfig,
  HudConfig,
  INACTIVE_FEATURE_SPRITE_FRAME,
} from './config';
import { UnlockedFeatureCallbacks, UnlockedFeatures } from '../types/savedData';
import { getGameHeight, getGameWidth } from '../helpers/gameDimensions';

import { HUD_PLUGIN_KEY } from '../constants';
import { LevelScene } from '../scenes/LevelScene';
import { v4 as uuidv4 } from 'uuid';

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
    inventory?: Phaser.GameObjects.Text;
    quests?: Phaser.GameObjects.Text;
    talents?: Phaser.GameObjects.Text;
  } = {};

  private _singularGraphicsGameObjects: {
    hpBarValue?: Phaser.GameObjects.Graphics;
    hpBarBackground?: Phaser.GameObjects.Graphics;
    inventoryActiveSprite?: Phaser.GameObjects.Sprite;
    inventoryInactiveSprite?: Phaser.GameObjects.Sprite;
    questsActiveSprite?: Phaser.GameObjects.Sprite;
    questsInactiveSprite?: Phaser.GameObjects.Sprite;
    talentsActiveSprite?: Phaser.GameObjects.Sprite;
    talentsInactiveSprite?: Phaser.GameObjects.Sprite;
  } = {};

  private _multiplicativeTextGameObjects: {
    buffs?: Phaser.GameObjects.Text[];
    debuffs?: Phaser.GameObjects.Text[];
  } = {};

  public _isInitialized: boolean = false;

  private _callbacks: {
    inventory: AnyCallback;
    quests: AnyCallback;
    talents: AnyCallback;
  } = {
    inventory: noop,
    quests: noop,
    talents: noop,
  };

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
      ._setHpBarGraphics()
      ._setFeatureSprites();

    if (showHp) {
      this._setHpBarBackground()._setHpTextDisplay();
    }

    this._isInitialized = true;
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
    if (value !== undefined) {
      this._setHpValue(value);
    } else {
      this._removeHpValue();
    }
  };

  public updateHealth = (value?: number) => {
    if (value !== undefined) {
      this._updateHpBar(value).updateHpValue(value);
    } else {
      this._removeHpValue();
    }
  };

  public updateUnlockedFeatures = (
    features: UnlockedFeatures,
    callbacks: UnlockedFeatureCallbacks,
  ) => {
    this._updateUnlockedFeatures(features, callbacks);
  };

  private _updateBasicText = (
    key: keyof typeof this._singularTextGameObjects,
    value?: string,
  ) => {
    if (!this._singularTextGameObjects[key]) return;
    if (value !== undefined) {
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
      ._setCenterTextDisplay()
      ._setFeatureTextDisplays();
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

    return this;
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
    if (value > 30) {
      barColor = highColor;
    } else if (value >= 15) {
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

  private _setFeatureSprites = () => {
    if (!this.config?.sprites?.featured) return this;
    const gameHeight = this._getGameHeight();
    const gameWidth = this._getGameWidth();

    Object.keys(this.config.sprites.featured).forEach((key, index) => {
      const {
        spriteKey,
        getPaddingX,
        paddingY,
        frame,
        hoverText,
        depth,
        scale,
      } = this.config.sprites.featured[key] as FeatureSpriteConfig;

      const x = gameWidth - getPaddingX(index);
      const y = gameHeight - paddingY;

      const activeSprite = this.scene.add
        .sprite(x, y, spriteKey, frame)
        .setScrollFactor(0)
        .setDepth(depth)
        .setVisible(false)
        .setScale(scale);

      const inactiveSprite = this.scene.add
        .sprite(x, y, spriteKey, INACTIVE_FEATURE_SPRITE_FRAME)
        .setScrollFactor(0)
        .setDepth(depth)
        .setVisible(true)
        .setScale(scale);

      const activeObjectKey = `${key}ActiveSprite`;
      const inactiveObjectKey = `${key}InactiveSprite`;
      this._singularGraphicsGameObjects[activeObjectKey] = activeSprite;
      this._singularGraphicsGameObjects[inactiveObjectKey] = inactiveSprite;

      activeSprite.on('pointerdown', () => this._callbacks[key]());

      this._addTooltip(x, y, activeSprite, hoverText);
    });

    return this;
  };

  private _setFeatureTextDisplays = () => {
    this._setFeatureTextDisplay('inventory', 'inventory', 0);
    this._setFeatureTextDisplay('quests', 'quest', 1);
    this._setFeatureTextDisplay('talents', 'talents', 2);
  };

  private _setFeatureTextDisplay = (
    textKey: keyof typeof this._singularTextGameObjects,
    configKey: keyof typeof this.config.texts,
    position: number,
  ) => {
    const {
      fontSize,
      fontFamily,
      fontColor,
      depth,
      getPaddingX,
      paddingY,
      align,
      text: content,
    } = this.config.texts[configKey] as FeatureTextConfig;

    const x = this._getGameWidth() - getPaddingX(position);
    const y = this._getGameHeight() - 16;

    this._singularTextGameObjects[textKey] = this.scene.make.text({
      x,
      y,
      depth,
      text: content,
      visible: false,
      scrollFactor: 0,
      origin: 0.5,
      style: {
        color: fontColor,
        fontFamily,
        fontSize: `${fontSize}px`,
        align,
      },
    });

    return this;
  };

  private _updateUnlockedFeatures = (
    features: UnlockedFeatures,
    callbacks: UnlockedFeatureCallbacks,
  ) => {
    const { inventory, questLog, talentTree } = features ?? {};

    const {
      inventory: inventoryCallback,
      quests: questsCallback,
      talents: talentsCallback,
    } = callbacks;

    let inventoryEnableDisable = inventory
      ? this._enableFeature
      : this._disableFeature;

    let questsEnableDisable = questLog
      ? this._enableFeature
      : this._disableFeature;

    let talentsEnableDisable = talentTree
      ? this._enableFeature
      : this._disableFeature;

    inventoryEnableDisable(
      'inventoryActiveSprite',
      'inventoryInactiveSprite',
      'inventory',
      'inventory',
      inventoryCallback,
    );
    questsEnableDisable(
      'questsActiveSprite',
      'questsInactiveSprite',
      'quests',
      'quests',
      questsCallback,
    );
    talentsEnableDisable(
      'talentsActiveSprite',
      'talentsInactiveSprite',
      'talents',
      'talents',
      talentsCallback,
    );
  };

  private _enableFeature = (
    activeSpriteKey: keyof typeof this._singularGraphicsGameObjects,
    inactiveSpriteKey: keyof typeof this._singularGraphicsGameObjects,
    textKey: keyof typeof this._singularTextGameObjects,
    callbackKey: keyof typeof this._callbacks,
    callback: AnyCallback,
  ) => {
    this._singularGraphicsGameObjects[activeSpriteKey]
      ?.setVisible(true)
      ?.setInteractive({ useHandCursor: true });
    this._singularGraphicsGameObjects[inactiveSpriteKey]?.setVisible(false);
    this._singularTextGameObjects[textKey]?.setVisible(true);
    this._callbacks[callbackKey] = callback;
  };

  private _disableFeature = (
    activeSpriteKey: keyof typeof this._singularGraphicsGameObjects,
    inactiveSpriteKey: keyof typeof this._singularGraphicsGameObjects,
    textKey: keyof typeof this._singularTextGameObjects,
    callbackKey: keyof typeof this._callbacks,
  ) => {
    this._singularGraphicsGameObjects[activeSpriteKey]
      ?.setVisible(false)
      ?.disableInteractive();
    this._singularGraphicsGameObjects[inactiveSpriteKey]?.setVisible(true);
    this._singularTextGameObjects[textKey]?.setVisible(false);
    this._callbacks[callbackKey] = noop;
  };

  private _addTooltip = (
    x: number,
    y: number,
    sprite: Phaser.GameObjects.Sprite,
    text: string,
  ) => {
    const id = uuidv4();
    (this.scene as LevelScene).phaserTooltip.createTooltip({
      x,
      y: y - 50,
      hasBackground: false,
      text: {
        text,
        fontFamily: 'monospace',
        fontSize: 16,
      },
      id,
      target: sprite,
    });

    (this.scene as LevelScene).phaserTooltip.hideTooltip(id);

    sprite.on(
      'pointerover',
      () => {
        (this.scene as LevelScene).phaserTooltip.showTooltip(id, true);
      },
      this.scene,
    );
    sprite.on(
      'pointerout',
      () => (this.scene as LevelScene).phaserTooltip.hideTooltip(id, true),
      this.scene,
    );
  };
}
