import Phaser from 'phaser';

// credit https://github.com/nkholski/phaser-plugin-starter and https://gamedevacademy.org/create-a-dialog-modal-plugin-in-phaser-3-part-1/
export default class DialogPlugin extends Phaser.Plugins.ScenePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager, 'dialog');
    this.scene = scene;
  }

  boot() {
    const eventEmitter = this.systems.events;

    eventEmitter.on('shutdown', this.shutdown, this);
    eventEmitter.on('destroy', this.destroy, this);
  }

  shutdown() {}

  destroy() {
    this.shutdown();
    this.scene = undefined;
  }
}
