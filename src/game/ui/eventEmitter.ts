import { HUD_INITIALIZED_EVENT, UPDATE_HEALTH_EVENT } from './events';

let instance: UIEventEmitter | null = null;
export class UIEventEmitter extends Phaser.Events.EventEmitter {
  constructor() {
    super();
  }

  static getInstance = () => instance ?? new UIEventEmitter();
}
