import {
  gregSpriteDefinition,
  greyCatSpriteDefinition,
  whiteCatSpriteDefinition,
} from '../assetDefinitions/sprites';

import { CreateSpriteParams } from '../types/assetDefinitions';
import { LevelScene } from './LevelScene';
import { levelOneMapDefinition } from '../assetDefinitions/tiles';

export class LevelOne extends LevelScene {
  constructor() {
    super('level-one');
    this.levelNumber = 1;
    this.startingGridCoordinates.x = 15;
    this.startingGridCoordinates.y = 96;
    this.mapDefinition = levelOneMapDefinition;
  }

  create = () => {
    this.setMap();

    this.setPlayerSprite();

    this.createAdditionalSprites();

    this.addCharacters();

    this.setupCharacterMovement();

    this.setCamera();

    this.setObjects();

    this.setDoors();

    this.attachKeyboardListener();
    this.dialog.init();
    this.createNewDialog(
      'hint: talk to Greg using space or enter to get started',
    );
  };

  update = () => {
    this.useGridPlayerControls();
    this.setFacing();
  };

  createAdditionalSprites = () => {
    const sprites: CreateSpriteParams[] = [
      {
        definition: gregSpriteDefinition,
        x: 25,
        y: 42,
        speed: 4,
      },
      {
        definition: greyCatSpriteDefinition,
        x: 23,
        y: 45,
        speed: 2,
      },
      {
        definition: whiteCatSpriteDefinition,
        x: 20,
        y: 45,
        speed: 2,
      },
    ];

    this.additionalCharacters = this.additionalCharacters.concat(sprites);
  };

  setupCharacterMovement = () => {
    this.characterMovements = {
      [gregSpriteDefinition.key]: 4,
      [greyCatSpriteDefinition.key]: 2,
      [whiteCatSpriteDefinition.key]: 2,
    };

    this.gridEngine.moveTo(gregSpriteDefinition.key, { x: 25, y: 50 });
    this.gridEngine.setSpeed(gregSpriteDefinition.key, 2);

    this.gridEngine.moveRandomly(
      greyCatSpriteDefinition.key,
      0,
      this.characterMovements[greyCatSpriteDefinition.key],
    );
    this.gridEngine.moveRandomly(
      whiteCatSpriteDefinition.key,
      100,
      this.characterMovements[whiteCatSpriteDefinition.key],
    );
  };

  setDoors = () => {
    this.doors = [
      {
        from: [
          { x: 19, y: 29 },
          { x: 20, y: 29 },
        ],
        to: { x: 15, y: 97 },
      },
      {
        from: [{ x: 15, y: 98 }],
        to: { x: 20, y: 31 },
      },
    ];
  };
}
