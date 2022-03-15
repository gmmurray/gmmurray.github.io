import { HUD_PLUGIN_KEY } from '../constants';
import { HudConfig } from '../types/hud';

const DEFAULT_CONFIG: HudConfig = {
  bottomText: {
    margin: 25,
    fontSize: 18,
    fontFamily: 'Arial',
    fontColor: '#fff',
    depth: 49,
  },
};

export default class HudPlugin extends Phaser.Plugins.ScenePlugin {
  public config: HudConfig = { ...DEFAULT_CONFIG };
  public bottomText: Phaser.GameObjects.Text;

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
    if (this.bottomText) this.bottomText.destroy();
  };

  public destroy = () => {
    this.shutdown();
    this.scene = undefined;
  };

  public init = (config?: HudConfig) => {
    this._setConfig(config ?? {});
    this._setBottomTextDisplay();
  };

  public updateBottomText = (value?: string) => {
    if (!this.bottomText) return;
    if (value) {
      this._setBottomText(value);
    } else {
      this._removeBottomText();
    }
  };

  public bottomTextIsDisplayed = () =>
    this.bottomText &&
    this.bottomText.visible &&
    this.bottomText.text &&
    this.bottomText.text !== '';

  private _setConfig = (config?: HudConfig) => {
    Object.keys(this.config).forEach(key => {
      this.config[key] = config[key] ?? this.config[key];
    });

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

  private _setBottomTextDisplay = () => {
    if (this.bottomText) this.bottomText.destroy();

    const {
      fontSize,
      fontFamily,
      fontColor,
      depth,
      margin,
    } = this.config.bottomText;

    const x = this._getGameWidth() / 2;
    const y = this._getGameHeight() - margin;

    this.bottomText = this.scene.make.text({
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

  private _setBottomText = (value: string) => {
    if (!this.bottomText) return;
    this.bottomText.setText(value);
    this.bottomText.setVisible(true);
  };

  private _removeBottomText = () => {
    this.bottomText.setVisible(false);
    this.bottomText.setText('');
  };
}
