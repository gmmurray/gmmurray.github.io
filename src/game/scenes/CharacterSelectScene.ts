import {
  CHARACTER_SELECT_SCENE_KEY,
  LEVEL_ONE_SCENE_KEY,
  THEME_SECONDARY_BLUE_NUMBER,
  THEME_YELLOW_NUMBER,
} from '../constants';
import {
  playerCharacterInformation,
  playerCharacterOptions,
} from '../assetDefinitions/sprites';

import { CharacterSelector } from '../characterSelect/characterSelector';
import { PlayerSpriteDefinition } from '../types/assetDefinitions';
import { SceneConfig } from '../types/SceneConfig';
import { UIEventEmitter } from '../ui/eventEmitter';

const lineHeight = 15;

const fontFamily = 'Monospace';
const fontSize = `${lineHeight}px`;

export class CharacterSelectScene extends Phaser.Scene {
  private _characterSelector: CharacterSelector;
  private _uiEmitter: UIEventEmitter;
  private _options: {
    definition: PlayerSpriteDefinition;
    container: Phaser.GameObjects.Container;
    graphics: Phaser.GameObjects.Graphics;
  }[] = [];
  private _selectedIndex: number | null = null;

  constructor() {
    super(CHARACTER_SELECT_SCENE_KEY);
  }

  public create = ({ uiEmitter, characterSelector }: SceneConfig) => {
    this._characterSelector = characterSelector;
    this._uiEmitter = uiEmitter;

    this._setAvatarContainers();
    //this._setDescriptionContainer();
    this._setButtons();
  };

  private _setAvatarContainers = () => {
    const screenWidth = this.cameras.main.width;
    const options = Object.values(playerCharacterOptions);

    const containerWidth = (screenWidth / options.length) * 2;

    let characterIndex = 0;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < options.length / 2; j++) {
        const index = characterIndex;
        const definition = options[index];

        const boxWidth = containerWidth - lineHeight * 2;
        const boxHeight = 5 * lineHeight;

        const graphics = this.add.graphics();
        graphics
          .lineStyle(2, THEME_SECONDARY_BLUE_NUMBER, 1)
          .strokeRect(0, 0, boxWidth, boxHeight);

        const text = this.add
          .text(
            boxWidth / 2,
            boxHeight / 2,
            playerCharacterInformation[definition.infoKey].name,
            { fontFamily, fontSize },
          )
          .setOrigin(0.5);

        const container = this.add.container(
          j * containerWidth + lineHeight,
          lineHeight + i * (lineHeight + lineHeight * 5),
          [graphics, text],
        );

        this._options.push({
          definition,
          container,
          graphics,
        });

        text
          .setInteractive({ useHandCursor: true })
          .on(
            'pointerdown',
            () => this._handleOptionSelect(index, boxWidth, boxHeight),
            this,
          );
        characterIndex++;
      }
    }
  };

  private _handleOptionSelect = (
    index: number,
    boxWidth: number,
    boxHeight: number,
  ) => {
    if (this._selectedIndex !== null) {
      this._options[this._selectedIndex].graphics
        .lineStyle(2, THEME_SECONDARY_BLUE_NUMBER, 1)
        .strokeRect(0, 0, boxWidth, boxHeight);
    }

    this._options[index].graphics
      .lineStyle(2, THEME_YELLOW_NUMBER, 1)
      .strokeRect(0, 0, boxWidth, boxHeight);

    this._selectedIndex = index;
  };

  private _setButtons = () => {
    const confirmButton = this.add
      .text(0, 0, 'Select this character', { fontFamily, fontSize })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', this._handleConfirmClick, this);

    const containerY = lineHeight * 13;
    this.add.container(lineHeight, containerY, confirmButton);
  };

  private _handleConfirmClick = () => {
    if (this._selectedIndex === null) return;

    this._characterSelector.setPlayerDefinition(
      this._options[this._selectedIndex].definition,
    );

    this.scene.start(
      LEVEL_ONE_SCENE_KEY,
      new SceneConfig(this._uiEmitter, this._characterSelector),
    );
  };
}
