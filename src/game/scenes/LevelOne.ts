import {
  gregSpriteDefinition,
  greyCatSpriteDefinition,
  whiteCatSpriteDefinition,
} from '../assetDefinitions/sprites';

import { CreateSpriteParams } from '../types/assetDefinitions';
import { LevelScene } from './LevelScene';
import { LEVEL_ONE_SCENE_KEY, RANDOM_MOVEMENT_DELAY } from '../constants';
import { levelOneMapDefinition } from '../assetDefinitions/tiles';
import { PortalType } from '../types/tileObject';

export class LevelOne extends LevelScene {
  constructor() {
    super(LEVEL_ONE_SCENE_KEY);
    this.levelNumber = 1;
    this.startingGridCoordinates.x = 28;
    this.startingGridCoordinates.y = 15;
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

    this.setPortals();

    this.attachKeyboardListener();

    this.dialog.init();
    this.createNewDialog(
      'hint: talk to Greg using space or enter to get started',
    );

    this.hud.init();
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
        friendlyName: 'Greg',
      },
      {
        definition: greyCatSpriteDefinition,
        x: 7,
        y: 93,
        speed: 2,
        friendlyName: 'Khufu',
      },
      {
        definition: whiteCatSpriteDefinition,
        x: 23,
        y: 95,
        speed: 2,
        friendlyName: 'Dre',
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
      RANDOM_MOVEMENT_DELAY,
      this.characterMovements[greyCatSpriteDefinition.key],
    );
    this.gridEngine.moveRandomly(
      whiteCatSpriteDefinition.key,
      RANDOM_MOVEMENT_DELAY + 200,
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
        to: { x: 15, y: 98 },
        friendlyName: 'go inside',
      },
      {
        from: [{ x: 15, y: 99 }],
        to: { x: 20, y: 31 },
        friendlyName: 'go outside',
      },
    ];
  };

  setPortals = () => {
    this.portals = [
      {
        from: {
          x: 16,
          y: 9,
        },
        type: PortalType.SCENE,
        to: '', // TODO: scene 2,
        dialog: 'the portal hums with energy as you approach it...',
        friendlyName: 'leftmost portal',
      },
      {
        from: {
          x: 28,
          y: 9,
        },
        type: PortalType.SCENE,
        to: '', // TODO: scene 3,
        dialog: 'the portal hums with energy as you approach it...',
        friendlyName: 'middle',
      },
      {
        from: {
          x: 40,
          y: 9,
        },
        type: PortalType.SCENE,
        to: '', // TODO: scene 4,
        dialog: 'the portal hums with energy as you approach it...',
        friendlyName: 'rightmost portal',
      },
    ];
  };
}
