import { DialogConfig } from '../types/dialog';
import Phaser from 'phaser';
import { DIALOG_PLUGIN_KEY } from '../constants';

// credit https://github.com/nkholski/phaser-plugin-starter and https://gamedevacademy.org/create-a-dialog-modal-plugin-in-phaser-3-part-1/
export default class DialogPlugin extends Phaser.Plugins.ScenePlugin {
  public config: DialogConfig = {
    borderThickness: 3,
    borderColor: 0x976f08,
    borderAlpha: 1,
    windowAlpha: 0.9,
    windowColor: 0x050a2b,
    windowHeight: 150,
    padding: 32,
    depth: 50,
    closeBtnColor: '#976f08',
    closeBtnFontSize: 24,
    fontSize: 20,
    speed: 5,
  };
  public eventCounter: number = 0;
  public visible: boolean = false;
  public text: Phaser.GameObjects.Text;
  public dialog: string[];
  public graphics: Phaser.GameObjects.Graphics;
  public closeBtn: Phaser.GameObjects.Text;
  public timedEvent: Phaser.Time.TimerEvent;

  constructor(
    scene: Phaser.Plugins.ScenePlugin['scene'],
    pluginManager: Phaser.Plugins.PluginManager,
  ) {
    super(scene, pluginManager, DIALOG_PLUGIN_KEY);
    this.scene = scene;
  }

  boot() {
    const eventEmitter = this.systems.events;

    eventEmitter.on('shutdown', this.shutdown, this);
    eventEmitter.on('destroy', this.destroy, this);
  }

  shutdown() {
    if (this.timedEvent) this.timedEvent.remove();
    if (this.text) this.text.destroy();
  }

  destroy() {
    this.shutdown();
    this.scene = undefined;
  }

  init = (options?: DialogConfig) => {
    if (!options) options = {};

    this.setOptions(options)._createWindow();
  };

  setOptions = (options?: DialogConfig) => {
    Object.keys(this.config).forEach(key => {
      this.config[key] = options[key] ?? this.config[key];
    });

    return this;
  };

  toggleWindow = (newValue: boolean = !this.visible) => {
    this.visible = newValue;
    if (this.text) this.text.setVisible(this.visible);
    if (this.graphics) this.graphics.setVisible(this.visible);
    if (this.closeBtn) this.closeBtn.visible = this.visible;
  };

  setText = (text: string, animate: boolean = true) => {
    this.eventCounter = 0;
    this.dialog = text.split('');
    if (this.timedEvent) this.timedEvent.remove();

    const temp = animate ? '' : text;
    this._setText(temp);

    if (animate) {
      this.timedEvent = this.scene.time.addEvent({
        delay: 150 - this.config.speed * 30,
        callback: this._animateText,
        callbackScope: this,
        loop: true,
      });
    }

    return this;
  };

  private _getGameWidth = () => {
    const value = this.scene.sys.game.config.width;
    return typeof value === 'number' ? value : parseInt(value);
  };

  private _getGameHeight = () => {
    const value = this.scene.sys.game.config.height;
    return typeof value === 'number' ? value : parseInt(value);
  };

  private _calculateWindowDimensions = (width: number, height: number) => ({
    x: this.config.padding!,
    y: height - this.config.windowHeight! - this.config.padding!,
    rectWidth: width - this.config.padding! * 2,
    rectHeight: this.config.windowHeight!,
  });

  private _createInnerWindow = (
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    this.graphics
      .fillStyle(this.config.windowColor!, this.config.windowAlpha!)
      .fillRect(x + 1, y + 1, width - 1, height - 1);

    return this;
  };

  private _createOuterWindow = (
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    this.graphics
      .lineStyle(
        this.config.borderThickness,
        this.config.borderColor,
        this.config.borderAlpha,
      )
      .strokeRect(x, y, width, height);
    return this;
  };

  private _createCloseModalButton = () => {
    const closeButton = this.scene.make.text({
      x:
        this._getGameWidth() -
        this.config.padding -
        this.config.closeBtnFontSize,
      y:
        this._getGameHeight() -
        this.config.windowHeight -
        this.config.padding +
        3,
      text: 'X',
      style: {
        font: `bold ${this.config.closeBtnFontSize}px Arial`,
        color: this.config.closeBtnColor,
      },
      depth: this.config.depth + 1,
      scrollFactor: 0,
    });

    closeButton.setInteractive();

    closeButton.on('pointerover', () => closeButton.setTint(0xff0000));
    closeButton.on('pointerout', () => closeButton.clearTint());
    closeButton.on('pointerdown', () => {
      this.toggleWindow();
      if (this.timedEvent) this.timedEvent.remove();
      if (this.text) this.text.destroy();
    });

    this.closeBtn = closeButton;
    return this;
  };

  private _createCloseModalButtonBorder = () => {
    const width = this.config.closeBtnFontSize + 8;
    const x = this._getGameWidth() - this.config.padding - width;
    const y =
      this._getGameHeight() - this.config.windowHeight - this.config.padding;
    this.graphics.strokeRect(x, y, width, width);
  };

  private _setText = (text: string) => {
    if (this.text) this.text.destroy();

    const x = this.config.padding + 10;
    const y =
      this._getGameHeight() -
      this.config.windowHeight -
      this.config.padding +
      10;

    this.text = this.scene.make.text({
      x,
      y,
      text,
      style: {
        wordWrap: {
          width: this._getGameWidth() - this.config.padding * 2 - 50,
          useAdvancedWrap: true,
        },
        color: '#fff',
        fontSize: `${this.config.fontSize}px`,
        fontFamily: 'Arial',
      },
      depth: this.config.depth,
      scrollFactor: 0,
    });
  };

  private _animateText = () => {
    this.eventCounter++;
    this.text.setText(this.text.text + this.dialog[this.eventCounter - 1]);
    if (this.eventCounter === this.dialog.length) {
      this.timedEvent.remove();
    }
  };

  private _createWindow = () => {
    const gameWidth = this._getGameWidth();

    const gameHeight = this._getGameHeight();

    const { x, y, rectWidth, rectHeight } = this._calculateWindowDimensions(
      gameWidth,
      gameHeight,
    );

    this.graphics = this.scene.add
      .graphics()
      .setDepth(this.config.depth)
      .setScrollFactor(0);

    this._createOuterWindow(x, y, rectWidth, rectHeight)
      ._createInnerWindow(x, y, rectWidth, rectHeight)
      ._createCloseModalButton()
      ._createCloseModalButtonBorder();

    if (this.graphics) this.graphics.setVisible(this.visible);
    if (this.text) this.text.setVisible(this.visible);
    if (this.closeBtn) this.closeBtn.setVisible(this.visible);
  };
}
