import { Direction, GridEngine } from 'grid-engine';
import {
  ENTER_EVENT_KEY,
  SCALE,
  SCALED_TILE_SIZE,
  SPACE_EVENT_KEY,
} from '../constants';
import { GameObjects, Geom, Scene, Tilemaps } from 'phaser';

import DialogPlugin from '../dialog/plugin';
import { TileMapDefinition } from '../types/assetDefinitions';
import { TileObject } from '../types/tileObject';
import { getAndPerformInteraction } from '../objects/interactions';
import { playerSpriteDefinition } from '../assetDefinitions/sprites';

export class LevelScene extends Scene {
  public playerSprite: GameObjects.Sprite | null = null;
  public objects: TileObject[] = [];
  facingObject?: TileObject = undefined;
  map: Tilemaps.Tilemap | null = null;
  gridEngine: GridEngine;
  levelNumber: number = 0;
  startingGridCoordinates: { x: number; y: number } = { x: 0, y: 0 };
  mapDefinition: TileMapDefinition | null = null;
  dialog: DialogPlugin | null;

  setMap = () => {
    if (!this.mapDefinition) return;
    const addedMap = this.make.tilemap({
      key: this.mapDefinition.key,
    });
    const tilesetNames = [];

    this.mapDefinition.tilesets.forEach(ts => {
      addedMap.addTilesetImage(ts.name, ts.key);
      tilesetNames.push(ts.name);
    });

    addedMap.layers.forEach((l, i) => {
      addedMap
        .createLayer(i, tilesetNames, 0, 0)
        .setScale(SCALE)
        .setDepth(i);
    });

    this.map = addedMap;
  };

  setPlayerSprite = () => {
    this.playerSprite = this.add
      .sprite(0, 0, playerSpriteDefinition.key)
      .setScale(SCALE);
    this.addPlayerCharacter();
  };

  setCamera = () => {
    if (!this.playerSprite) return;
    this.cameras.main
      .startFollow(this.playerSprite, true)
      .setFollowOffset(-this.playerSprite.width, -this.playerSprite.height)
      .setZoom(1)
      .setRoundPixels(true);
  };

  setObjects = () => {
    if (!this.map || !this.mapDefinition) return;
    const data = this.map.getLayer(this.mapDefinition.objectLayer)?.data;

    if (!data) return;

    data.forEach(d => {
      d.forEach(t => {
        const { x, y, properties } = t;

        // add "object" tile for each tile defined to have object properties in this layer
        if (properties && properties.type) {
          const newSprite = this.addObjectSprite();

          const newObject = {
            ...properties,
            sprite: newSprite,
            x,
            y,
          };

          this.addObjectCharacter(newObject);

          this.objects.push(newObject);
        }
      });
    });
  };

  addPlayerCharacter = () => {
    if (!this.map) return;
    const gridEngineConfig = {
      characters: [
        {
          id: playerSpriteDefinition.key,
          sprite: this.playerSprite,
          startPosition: {
            x: this.startingGridCoordinates.x,
            y: this.startingGridCoordinates.y,
          },
          walkingAnimationMapping:
            playerSpriteDefinition.walkingAnimationMapping,
        },
      ],
    };

    this.gridEngine.create(this.map, gridEngineConfig);
  };

  addObjectSprite = () =>
    this.add
      .sprite(0, 0, '')
      .setScale(SCALE)
      .setVisible(false);

  addObjectCharacter = (object: TileObject) =>
    this.gridEngine.addCharacter({
      id: `object_${object.name}_${object.x}_${object.y}`,
      sprite: object.sprite,
      collides: true,
      startPosition: { x: object.x, y: object.y },
    });

  // credit to https://github.com/Annoraaq/grid-engine/issues/235#issuecomment-1061049631
  setFacingObject = () => {
    // @ts-ignore
    const { x, y } = this.gridEngine.getFacingDirection(
      playerSpriteDefinition.key,
    );

    const tileRect = new Geom.Rectangle(
      x * SCALED_TILE_SIZE,
      y * SCALED_TILE_SIZE,
      SCALED_TILE_SIZE,
      SCALED_TILE_SIZE,
    );

    this.facingObject = this.objects.filter(o =>
      Geom.Intersects.RectangleToRectangle(o.sprite.getBounds(), tileRect),
    )[0];
  };

  attachKeyboardListener = () =>
    this.input.keyboard.on('keydown', this.handleInteraction, this);

  handleInteraction = event => {
    if (!this.facingObject) return;

    if (event.key === ENTER_EVENT_KEY || event.key === SPACE_EVENT_KEY) {
      getAndPerformInteraction({
        type: this.facingObject.type,
        level: this.levelNumber,
        tileX: this.facingObject.x,
        tileY: this.facingObject.y,
      });
    }
  };

  useGridPlayerControls = () => {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.gridEngine.move(playerSpriteDefinition.key, Direction.LEFT);
    } else if (cursors.right.isDown) {
      this.gridEngine.move(playerSpriteDefinition.key, Direction.RIGHT);
    } else if (cursors.up.isDown) {
      this.gridEngine.move(playerSpriteDefinition.key, Direction.UP);
    } else if (cursors.down.isDown) {
      this.gridEngine.move(playerSpriteDefinition.key, Direction.DOWN);
    }
  };
}
