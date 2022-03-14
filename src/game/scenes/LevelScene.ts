import { CharacterData, Direction, GridEngine } from 'grid-engine';
import {
  CharacterDataExtended,
  CreateSpriteParams,
  TileMapDefinition,
} from '../types/assetDefinitions';
import {
  DoorDefinition,
  PortalDefinition,
  PortalType,
  TileObject,
} from '../types/tileObject';
import {
  ENTER_EVENT_KEY,
  RANDOM_MOVEMENT_DELAY,
  SCALE,
  SCALED_TILE_SIZE,
  SPACE_EVENT_KEY,
} from '../constants';
import { GameObjects, Geom, Scene, Tilemaps } from 'phaser';

import AnimatedTilesPlugin from 'phaser-animated-tiles-phaser3.5';
import { Coordinates } from '../types/position';
import DialogPlugin from '../dialog/plugin';
import { InteractionType } from '../types/interactions';
import { getAndPerformInteraction } from '../interactions/interactions';
import { playerSpriteDefinition } from '../assetDefinitions/sprites';
import HudPlugin from '../hud/plugin';

export class LevelScene extends Scene {
  public playerSprite: GameObjects.Sprite | null = null;
  public objects: TileObject[] = [];
  public facingObject?: TileObject = undefined;
  public map: Tilemaps.Tilemap | null = null;
  public gridEngine: GridEngine;
  public animatedTiles: AnimatedTilesPlugin;
  public levelNumber: number = 0;
  public startingGridCoordinates: Coordinates = { x: 0, y: 0 };
  public mapDefinition: TileMapDefinition | null = null;
  public dialog: DialogPlugin | null;
  public characters: CharacterDataExtended[] = [];
  public characterMovements: Record<string, number>; // key: character key. value: character radius
  public additionalCharacters: CreateSpriteParams[] = [];
  public facingCharacter?: CharacterDataExtended = undefined;
  public closeDialogCallback: Function | null = null;
  public facingDoor?: DoorDefinition = undefined;
  public doors: DoorDefinition[] = [];
  public portals: PortalDefinition[] = [];
  public facingPortal?: PortalDefinition = undefined;
  public hud: HudPlugin;

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

    for (let i = 0; i < addedMap.layers.length; i++) {
      const layer = addedMap.createLayer(i, tilesetNames, 0, 0);
      layer.scale = SCALE;
    }

    if (
      addedMap.layers.some(l => l.name === this.mapDefinition.animatedLayer)
    ) {
      this.animatedTiles.init(addedMap);
    }

    this.map = addedMap;
  };

  setPlayerSprite = () => {
    this.playerSprite = this.add
      .sprite(0, 0, playerSpriteDefinition.key)
      .setScale(playerSpriteDefinition.scale);

    this.characters.push({
      id: playerSpriteDefinition.key,
      sprite: this.playerSprite,
      startPosition: {
        x: this.startingGridCoordinates.x,
        y: this.startingGridCoordinates.y,
      },
      walkingAnimationMapping: playerSpriteDefinition.walkingAnimationMapping,
      speed: 5,
    });
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
    const data = (
      this.map.getLayer(this.mapDefinition.objectLayer)?.data ?? []
    ).filter(d => d.some(t => t.index !== -1));

    if (!data || data.length === 0) return;

    data.forEach(d => {
      d.filter(t => t.index !== -1).forEach(t => {
        const { x, y, properties } = t;

        // add "object" tile for each tile defined to have object properties in this layer TODO: AND if they are in this.itemdefinitions
        if (properties && properties.type !== undefined) {
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

  setAdditionalSprites = () => {
    const charDefinitions: CharacterDataExtended[] = this.additionalCharacters.map(
      ac => ({
        id: ac.definition.key,
        sprite: this.add
          .sprite(0, 0, ac.definition.key)
          .setScale(ac.definition.scale),
        startPosition: {
          x: ac.x,
          y: ac.y,
        },
        walkingAnimationMapping: ac.definition.walkingAnimationMapping,
        speed: ac.speed,
        friendlyName: ac.friendlyName,
      }),
    );
    this.characters = this.characters.concat(charDefinitions);
  };

  addCharacters = () => {
    if (!this.map) return;

    this.setAdditionalSprites();

    this.gridEngine.create(this.map, { characters: this.characters });
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
  setFacing = () => {
    // @ts-ignore
    const { x, y } = this.gridEngine.getFacingPosition(
      playerSpriteDefinition.key,
    );

    const tileRect = new Geom.Rectangle(
      x * SCALED_TILE_SIZE,
      y * SCALED_TILE_SIZE,
      SCALED_TILE_SIZE,
      SCALED_TILE_SIZE,
    );

    this.facingObject = this.objects.find(o =>
      Geom.Intersects.RectangleToRectangle(o.sprite.getBounds(), tileRect),
    );
    this.facingCharacter = this.characters.find(
      o =>
        o.id !== playerSpriteDefinition.key &&
        Geom.Intersects.RectangleToRectangle(o.sprite.getBounds(), tileRect),
    );
    this.facingPortal = this.portals.find(p =>
      Geom.Intersects.RectangleToRectangle(
        new Geom.Rectangle(
          p.from.x * SCALED_TILE_SIZE,
          p.from.y * SCALED_TILE_SIZE,
          SCALED_TILE_SIZE,
          SCALED_TILE_SIZE,
        ),
        tileRect,
      ),
    );
    this.facingDoor = this.doors.find(d =>
      Geom.Intersects.RectangleToRectangle(
        new Geom.Rectangle(
          d.from[0].x * SCALED_TILE_SIZE,
          d.from[0].y * SCALED_TILE_SIZE,
          SCALED_TILE_SIZE,
          SCALED_TILE_SIZE,
        ),
        tileRect,
      ),
    );

    const bottomTextValue =
      this.facingObject?.friendlyName ??
      this.facingCharacter?.friendlyName ??
      this.facingPortal?.friendlyName ??
      this.facingDoor?.friendlyName;

    if (bottomTextValue && !this.dialog.visible) {
      this.addHudBottomText(bottomTextValue);
    } else if (this.hud.bottomTextIsDisplayed()) {
      this.removeHudBottomText();
    }
  };

  attachKeyboardListener = () =>
    this.input.keyboard.on('keydown', this.handleInteraction, this);

  handleInteraction = event => {
    if (!this.facingObject && !this.facingCharacter && !this.dialog.visible)
      return;

    if (event.key === ENTER_EVENT_KEY || event.key === SPACE_EVENT_KEY) {
      const isCharacterInteraction = !!this.facingCharacter;
      // if the dialog is open: close it
      if (this.dialog.visible) {
        // also resume movement if it was a character that was being interacted with
        if (isCharacterInteraction) {
          this.resumeMovement(this.facingCharacter.id);
        }
        return this.handleCloseDialog();
      }

      let type: InteractionType;
      let tileX: number;
      let tileY: number;
      let charId: string | undefined;

      if (isCharacterInteraction) {
        // at this point, if it is a dialog interaction, the dialog is not open yet.
        // pause movement and dialog will be handled by the interaction handler
        this.pauseMovement(this.facingCharacter.id).turnCharacterTowardsPlayer(
          this.facingCharacter.id,
        );
        type = InteractionType.CHAR;
        tileX = 0;
        tileY = 0;
        charId = this.facingCharacter.id;
      } else {
        type = this.facingObject.type;
        tileX = this.facingObject.x;
        tileY = this.facingObject.y;
        charId = undefined;
      }
      getAndPerformInteraction({
        type,
        level: this.levelNumber,
        tileX,
        tileY,
        charId,
        scene: this,
      });
    }
  };

  useGridPlayerControls = () => {
    if (this.dialog.visible) {
      return;
    }
    const cursors = this.input.keyboard.createCursorKeys();
    const wasd = this.input.keyboard.addKeys('W,A,S,D');

    if (cursors.left.isDown || wasd['A'].isDown) {
      this.gridEngine.move(playerSpriteDefinition.key, Direction.LEFT);
    } else if (cursors.right.isDown || wasd['D'].isDown) {
      this.gridEngine.move(playerSpriteDefinition.key, Direction.RIGHT);
    } else if (cursors.up.isDown || wasd['W'].isDown) {
      this.gridEngine.move(playerSpriteDefinition.key, Direction.UP);
    } else if (cursors.down.isDown || wasd['S'].isDown) {
      this.gridEngine.move(playerSpriteDefinition.key, Direction.DOWN);
    }

    if (
      !this.gridEngine.isMoving(playerSpriteDefinition.key) &&
      this.doors.length > 0
    ) {
      this.handleDoorCollision();
    }

    if (
      !this.gridEngine.isMoving(playerSpriteDefinition.key) &&
      this.portals.length > 0
    ) {
      this.handlePortalCollision();
    }
  };

  createNewDialog = (text: string) => {
    this.dialog.setText(text);
    this.dialog.toggleWindow(true);
    this.removeHudBottomText(); // the hud bottom text should always be removed so it doesnt overlap with dialog
  };

  handleCloseDialog = () => {
    if (this.closeDialogCallback !== null) {
      this.closeDialogCallback();
    }
    this.dialog.toggleWindow(false);
    this.closeDialogCallback = null;
  };

  resumeMovement = (key: string) => {
    if (!Object.keys(this.characterMovements).some(k => k === key)) {
      return;
    }

    if (!this.gridEngine.isMoving(key)) {
      setTimeout(() => {
        if (!this.dialog.visible) {
          this.gridEngine.moveRandomly(
            key,
            RANDOM_MOVEMENT_DELAY,
            this.characterMovements[key],
          );
        }
      }, 30 * 1000);
    }
  };

  pauseMovement = (key: string) => {
    if (!Object.keys(this.characterMovements).some(k => k === key)) {
      return this;
    }

    if (this.gridEngine.isMoving(key)) {
      this.gridEngine.stopMovement(key);
    }
    return this;
  };

  turnCharacterTowardsPlayer = (key: string) => {
    if (this.gridEngine.isMoving(key)) {
      // sometimes the movement doesn't stop fast enough and we can't turn the character
      // this helps with that so we keep trying to turn the character without blowing up the stack
      return setTimeout(() => this.turnCharacterTowardsPlayer(key), 50);
    }
    let newDir: Direction;
    const playerDir = this.gridEngine.getFacingDirection(
      playerSpriteDefinition.key,
    );
    switch (playerDir) {
      case Direction.DOWN:
        newDir = Direction.UP;
        break;
      case Direction.UP:
        newDir = Direction.DOWN;
        break;
      case Direction.LEFT:
        newDir = Direction.RIGHT;
        break;
      case Direction.RIGHT:
        newDir = Direction.LEFT;
        break;
    }

    this.gridEngine.turnTowards(key, newDir);
  };

  handleDoorCollision = () => {
    const pos = this.gridEngine.getPosition(playerSpriteDefinition.key);
    const match = this.doors.find(door =>
      door.from.some(
        coordinate => coordinate.x === pos.x && coordinate.y === pos.y,
      ),
    );

    if (match) {
      this.cameras.main.flash(750, 0, 0, 0);
      this.gridEngine.setPosition(playerSpriteDefinition.key, match.to);
    }
  };

  // portals are similar to doors except they might trigger a dialog or start a scene
  handlePortalCollision = () => {
    const pos = this.gridEngine.getPosition(playerSpriteDefinition.key);
    const match = this.portals.find(
      portal => portal.from.x === pos.x && portal.from.y === pos.y,
    );

    if (match) {
      if (match.dialog) {
        this.createNewDialog(match.dialog);
      }

      if (match.type === PortalType.SCENE && typeof match.to === 'string') {
        this.cameras.main.flash(1500, 0, 0, 0); // temp
        const currPos = this.gridEngine.getPosition(playerSpriteDefinition.key);
        this.gridEngine.setPosition(playerSpriteDefinition.key, {
          x: currPos.x,
          y: currPos.y + 1,
        });
        // this.cameras.main.fade(750, 0, 0, 0); TODO: switch to this once the new scenes are set up
        // this.scene.start(match.to); TODO: use this once scene is set up
      } else if (
        match.type === PortalType.COORDINATE &&
        typeof match.to === 'object'
      ) {
        this.gridEngine.setPosition(playerSpriteDefinition.key, match.to);
      }
    }
  };

  public addHudBottomText = (text: string) => this.hud.updateBottomText(text);
  public removeHudBottomText = () => this.hud.updateBottomText();
}
