import { playerCharacterOptions } from '../assetDefinitions/sprites';
import { SpriteDefinition } from '../types/assetDefinitions';

let instance: CharacterSelector | null = null;
export class CharacterSelector {
  private _defaultPlayerDefinition: SpriteDefinition;
  private _selectedPlayerDefinition: SpriteDefinition | null = null;

  constructor() {
    this._defaultPlayerDefinition = this._createDefaultCharacter();
  }

  private _createDefaultCharacter = () => {
    const num = Math.floor(Math.random() * playerCharacterOptions.length);

    return playerCharacterOptions[num];
  };

  public getPlayerDefinition = () =>
    this._selectedPlayerDefinition ?? this._defaultPlayerDefinition;

  static getInstance = () => instance ?? new CharacterSelector();
}
