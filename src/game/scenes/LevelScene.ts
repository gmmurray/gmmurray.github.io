import {
  Character,
  DoorDefinition,
  ItemDefinition,
  LevelCast,
  NpcCharacter,
  PlayerCharacter,
  PortalDefinition,
  PortalType,
} from '../types/interactions';
import { CharacterData, Direction, GridEngine } from 'grid-engine';
import {
  ENTER_EVENT_KEY,
  RANDOM_MOVEMENT_DELAY,
  SCALE,
  SCALED_TILE_SIZE,
  SPACE_EVENT_KEY,
} from '../constants';
import { Geom, Scene, Tilemaps } from 'phaser';

import AnimatedTilesPlugin from 'phaser-animated-tiles-phaser3.5';
import DialogPlugin from '../dialog/plugin';
import HudPlugin from '../hud/plugin';
import { TileMapDefinition } from '../types/assetDefinitions';
import { playerSpriteDefinition } from '../assetDefinitions/sprites';

export class LevelScene extends Scene {
  // plugins
  public gridEngine: GridEngine;
  public dialog: DialogPlugin;
  public dialogDisabled = false;
  public hud: HudPlugin;

  // characters
  public playerCharacter?: PlayerCharacter = null;
  public characters: Character[] = [];
  public facingCharacter?: NpcCharacter = undefined;
  public cast?: LevelCast = undefined;

  // tiles
  public map: Tilemaps.Tilemap | null = null;
  public animatedTiles: AnimatedTilesPlugin;
  public mapDefinition: TileMapDefinition | null = null;
  public levelNumber: number = 0;

  // interactables
  public doors: DoorDefinition[] = [];
  public facingDoor?: DoorDefinition = undefined;
  public portals: PortalDefinition[] = [];
  public facingPortal?: PortalDefinition = undefined;
  public items: ItemDefinition[] = [];
  public facingItem?: ItemDefinition = undefined;

  // dev mode
  public isDev = process.env.NODE_ENV === 'development';

  public isMovementPaused: boolean = false;

  /**
   * sets player character and combines with npc characters to set characters
   *
   * @returns this scene (chainable)
   */
  public setCharacters = () => {
    if (!this.cast) return this;

    const player = this._createPlayerCharacter(this.cast.player);
    const npcs = this._createNpcCharacters(this.cast.npcs);

    this.playerCharacter = player;
    this.characters = [player, ...npcs];

    return this;
  };

  /**
   * sets up main camera to follow player character
   *
   * @returns this scene (chainable)
   */
  public setCamera = () => {
    const { playerCharacter: { sprite = undefined } = {} } = this;

    if (!sprite) return;

    this.cameras.main
      .startFollow(sprite, true)
      .setFollowOffset(-sprite.width, -sprite.height)
      .setZoom(1)
      .setRoundPixels(true);

    return this;
  };

  /**
   * sets items
   *
   * @returns this scene (chainable)
   */
  public setItems = () => {
    if (!this.cast) return this;

    const createdItems = this._createItems(this.cast.items);

    this.items = [...createdItems];

    return this;
  };

  /**
   * sets portals
   *
   * @param portals
   * @returns this scene (chainable)
   */
  public setPortals = () => {
    if (!this.cast) return this;

    this.portals = this.cast.portals;

    return this;
  };

  /**
   * sets doors
   *
   * @param doors
   * @returns this scene (chainable)
   */
  public setDoors = () => {
    if (!this.cast) return this;

    this.doors = this.cast.doors;

    return this;
  };

  /**
   * sets tilemap, tilesets, layers, and animated layer if applicable. also creates the grid engine map + characters
   *
   * @returns this scene (chainable)
   */
  public setMap = () => {
    if (!this.mapDefinition) throw new Error('no tilemap defined');
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
    this._setGridEngineMap();

    return this;
  };

  /**
   * sets up any character layer transitions
   *
   * @returns this scene (chainable)
   */
  public setCharacterLayerTransitions = () => {
    if (!this.mapDefinition?.characterLayer || !this.gridEngine) {
      return this;
    }

    const {
      characterLayer: { lower, upper, transitions },
    } = this.mapDefinition;

    transitions.forEach(({ x, y, toUpper }) => {
      let fromLayer: string;
      let toLayer: string;

      if (toUpper) {
        fromLayer = lower;
        toLayer = upper;
      } else {
        fromLayer = upper;
        toLayer = lower;
      }

      this.gridEngine.setTransition({ x, y }, fromLayer, toLayer);
    });

    return this;
  };

  /**
   * sets up collision handlers and controls for supporting arrow keys and WASD. add to update method
   *
   * @returns this scene (chainable)
   */
  public useGridPlayerControls = () => {
    if (!this.playerCharacter) {
      return this;
    }
    if (this.dialog.visible || this.isMovementPaused) {
      return this;
    }
    const cursors = this.input.keyboard.createCursorKeys();
    const wasd = this.input.keyboard.addKeys('W,A,S,D');
    const {
      definition: { key },
    } = this.playerCharacter;

    if (cursors.shift.isDown) {
      this.gridEngine.setSpeed(
        this.playerCharacter.definition.key,
        this.playerCharacter.startingSpeed * 2,
      );
    } else {
      this.gridEngine.setSpeed(
        this.playerCharacter.definition.key,
        this.playerCharacter.startingSpeed,
      );
    }

    if (cursors.left.isDown || wasd['A'].isDown) {
      this.gridEngine.move(key, Direction.LEFT);
    } else if (cursors.right.isDown || wasd['D'].isDown) {
      this.gridEngine.move(key, Direction.RIGHT);
    } else if (cursors.up.isDown || wasd['W'].isDown) {
      this.gridEngine.move(key, Direction.UP);
    } else if (cursors.down.isDown || wasd['S'].isDown) {
      this.gridEngine.move(key, Direction.DOWN);
    }

    if (!this.gridEngine.isMoving(key) && this.doors.length > 0) {
      this._handleDoorCollision();
    }

    if (!this.gridEngine.isMoving(key) && this.portals.length > 0) {
      this._handlePortalCollision();
    }

    return this;
  };

  /**
   * determines if the player is facing an item, character, door, or portal based on player position
   *
   * credit to https://github.com/Annoraaq/grid-engine/issues/235#issuecomment-1061049631 for the idea
   *
   * @returns this scene (chainable)
   */
  public setFacing = () => {
    if (!this.playerCharacter) return;
    this.facingCharacter = undefined;
    this.facingDoor = undefined;
    this.facingItem = undefined;
    this.facingPortal = undefined;

    const { x, y } = this.gridEngine.getFacingPosition(
      this.playerCharacter.definition.key,
    );

    const tileRect = this._createTileRectangle(x, y);
    let bottomTextValue: string | undefined = undefined;
    this.facingItem = this.items.find(item =>
      Geom.Intersects.RectangleToRectangle(item.sprite.getBounds(), tileRect),
    );

    if (this.facingItem) {
      bottomTextValue = this.facingItem.friendlyName;
    } else {
      this.facingCharacter = this.characters
        .filter(c => c.definition.key !== this.playerCharacter.definition.key)
        .find(o =>
          Geom.Intersects.RectangleToRectangle(o.sprite.getBounds(), tileRect),
        );
    }

    if (this.facingCharacter) {
      bottomTextValue = this.facingCharacter.friendlyName;
    } else {
      this.facingPortal = this.portals.find(p =>
        Geom.Intersects.RectangleToRectangle(
          this._createTileRectangle(p.from.x, p.from.y),
          tileRect,
        ),
      );
    }

    if (this.facingPortal) {
      bottomTextValue = this.facingPortal.friendlyName;
    } else {
      this.facingDoor = this.doors.find(d =>
        Geom.Intersects.RectangleToRectangle(
          this._createTileRectangle(d.from[0].x, d.from[0].y),
          tileRect,
        ),
      );
    }

    if (this.facingDoor) {
      bottomTextValue = this.facingDoor.friendlyName;
    }

    if (bottomTextValue && !this.dialog.visible) {
      this.addHudBottomText(bottomTextValue);
    } else if (this.hud.bottomTextIsDisplayed()) {
      this.removeHudBottomText();
    }

    return this;
  };

  /**
   * attaches keyboard listener for handling interactions
   *
   * @returns this scene (chainable)
   */
  public attachKeyboardListener = () => {
    this.input.keyboard.on('keydown', this.handleInteraction, this);

    return this;
  };

  /**
   * handler for keydown events
   *
   * @param event keyboard down event
   * @returns this scene (chainable)
   */
  public handleInteraction = event => {
    // if a non-interact key is pressed or there is nothing to interact with: nothing to see here
    if (
      !(event.key === ENTER_EVENT_KEY || event.key === SPACE_EVENT_KEY) ||
      (!this.facingItem && !this.facingCharacter && !this.dialog.visible)
    ) {
      return this;
    }

    if (this.facingCharacter) {
      this._handleCharacterInteraction();
    } else if (this.facingItem) {
      this._handleItemInteraction();
    } else {
      // dialog interaction
      this.handleCloseDialog();
    }

    return this;
  };

  /**
   * creates and opens the dialog window
   *
   * @param text
   */
  public createNewDialog = (text: string) => {
    this.dialog.setText(text);
    this.dialog.toggleWindow(true);
    this.removeHudBottomText(); // the hud bottom text should always be removed so it doesnt overlap with dialog
  };

  /**
   * closes the dialog window
   */
  public handleCloseDialog = () => {
    if (this.dialogDisabled) return;
    this.dialog.toggleWindow(false);
  };

  /**
   * if the character is supposed to move, it will be scheduled to move again in x seconds (default 30)
   *
   * @param character
   * @returns  this scene (chainable)
   */
  public resumeMovement = (character: NpcCharacter, seconds: number = 30) => {
    const {
      definition: { key },
      radius,
    } = character;
    if (radius !== undefined && !this.gridEngine.isMoving(key)) {
      setTimeout(() => {
        if (!this.dialog.visible) {
          this.gridEngine.moveRandomly(key, RANDOM_MOVEMENT_DELAY, radius);
        }
      }, seconds * 1000);
    }

    return this;
  };

  /**
   * stops the character's movement if they are moving
   *
   * @param character
   * @returns this scene (chainable)
   */
  public pauseMovement = (character: NpcCharacter) => {
    const {
      definition: { key },
    } = character;

    if (this.gridEngine.isMoving(key)) {
      this.gridEngine.stopMovement(key);
    }

    return this;
  };

  /**
   * repeatedly tries to turn the character towards the player
   *
   * @param character
   * @returns this scene (chainable)
   */
  public turnCharacterTowardsPlayer = (character: NpcCharacter) => {
    if (!this.playerCharacter) return;

    const {
      definition: { key },
    } = character;
    if (this.gridEngine.isMoving(key)) {
      // sometimes the movement doesn't stop fast enough and we can't turn the character
      // this helps with that so we keep trying to turn the character without blowing up the stack
      return setTimeout(() => this.turnCharacterTowardsPlayer(character), 50);
    }
    let newDir: Direction;
    const playerDir = this.gridEngine.getFacingDirection(
      this.playerCharacter.definition.key,
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

    return this;
  };

  /**
   * adds and shows hud bottom text
   *
   * @param text
   * @returns this scene (chainable)
   */
  public addHudBottomText = (text: string) => {
    this.hud.updateBottomText(text);
    return this;
  };

  /**
   * hides hud bottom text
   *
   * @returns this scene (chainable)
   */
  public removeHudBottomText = () => {
    this.hud.updateBottomText();
    return this;
  };

  /**
   * @param character player without sprite
   * @returns character with created sprite
   */
  private _createPlayerCharacter = (
    character: PlayerCharacter,
  ): PlayerCharacter => {
    const {
      definition: { key, scale },
    } = character;
    return {
      ...character,
      sprite: this.add.sprite(0, 0, key).setScale(scale),
    };
  };

  /**
   * @param characters npc characters without sprites
   * @returns npc characters with created sprites
   */
  private _createNpcCharacters = (
    characters: NpcCharacter[],
  ): NpcCharacter[] => {
    return characters.map(c => ({
      ...c,
      sprite: this.add
        .sprite(0, 0, c.definition.key)
        .setScale(c.definition.scale),
    }));
  };

  /**
   * @param items items without sprites
   * @returns items with created sprites
   */
  private _createItems = (items: ItemDefinition[]): ItemDefinition[] => {
    return items.map(item => ({
      ...item,
      sprite: this.add
        .sprite(0, 0, '')
        .setScale(SCALE)
        .setVisible(false),
    }));
  };

  /**
   * uses the scene's characters and items to create a grid engine map
   *
   * @returns this scene (chainable)
   */
  private _setGridEngineMap = () => {
    if (this.gridEngine && this.map) {
      const characters = [
        ...this._createGridEngineCharacters(),
        ...this._createGridEngineItems(),
      ];

      this.gridEngine.create(this.map, { characters });
    }

    return this;
  };

  /**
   * creates grid engine characters using the scene's characters
   *
   * @returns grid engine characters
   */
  private _createGridEngineCharacters = (): CharacterData[] => {
    return this.characters
      .filter(c => !!c.sprite)
      .map(
        ({
          sprite,
          definition: { key, walkingAnimationMapping },
          startingX,
          startingY,
          startingSpeed,
        }) => ({
          id: key,
          startPosition: {
            x: startingX,
            y: startingY,
          },
          speed: startingSpeed,
          sprite,
          walkingAnimationMapping,
        }),
      );
  };

  /**
   * creates grid engine items (basically characters) using the scene's items
   * @returns grid engine items
   */
  private _createGridEngineItems = (): CharacterData[] => {
    return this.items
      .filter(i => !!i.sprite)
      .map(({ x, y, sprite }) => ({
        id: `object_${this.levelNumber}_${x}_${y}`,
        collides: true,
        startPosition: { x, y },
        sprite,
      }));
  };

  /**
   * handles the player interacting with a character
   *
   * @returns this scene (chainable)
   */
  private _handleCharacterInteraction = () => {
    if (!this.facingCharacter) return this;

    // if the dialog is open, just close it and have the character go back to wandering
    if (this.dialog.visible) {
      this.resumeMovement(this.facingCharacter);
      this.handleCloseDialog();
      return this;
    }

    // first we pause the character's movement
    this.pauseMovement(this.facingCharacter).turnCharacterTowardsPlayer(
      this.facingCharacter,
    );

    if (this.facingCharacter.handler) {
      this.facingCharacter.handler(this);
    }

    return this;
  };

  /**
   * handles the player interacting with an item
   *
   * @returns this scene (chainable)
   */
  private _handleItemInteraction = () => {
    if (!this.facingItem) return this;

    if (this.dialog.visible) {
      this.handleCloseDialog();
      return this;
    }

    if (this.facingItem && this.facingItem.handler) {
      this.facingItem.handler(this);
    }

    return this;
  };

  /**
   * handles when the player uses a door. triggers movement
   *
   * @returns this scene (chainable)
   */
  private _handleDoorCollision = () => {
    const pos = this.gridEngine.getPosition(
      this.playerCharacter.definition.key,
    );
    const match = this.doors.find(door =>
      door.from.some(
        coordinate => coordinate.x === pos.x && coordinate.y === pos.y,
      ),
    );

    if (match) {
      this.cameras.main.flash(750, 0, 0, 0);
      this.gridEngine.setPosition(playerSpriteDefinition.key, match.to);
      if (match.face) {
        this.gridEngine.turnTowards(
          this.playerCharacter.definition.key,
          match.face,
        );
      }
    }

    return this;
  };

  /**
   * handles the player using a portal. similar to doors except the portal can trigger dialogs OR movement
   *
   * @returns this scene (chainable)
   */
  private _handlePortalCollision = () => {
    const pos = this.gridEngine.getPosition(
      this.playerCharacter.definition.key,
    );
    const match = this.portals.find(
      portal => portal.from.x === pos.x && portal.from.y === pos.y,
    );

    if (match) {
      if (match.dialog) {
        this.createNewDialog(match.dialog);
      }

      if (match.type === PortalType.SCENE && typeof match.to === 'string') {
        this.dialogDisabled = true;
        setTimeout(() => {
          this.cameras.main.fade(2500, 0, 0, 0);
        }, 1000);
        setTimeout(() => {
          // @ts-ignore
          this.scene.start(match.to);
          this.scene.sleep(this.scene.key);
        }, 3500);
      } else if (
        match.type === PortalType.COORDINATE &&
        typeof match.to === 'object'
      ) {
        this.gridEngine.setPosition(
          this.playerCharacter.definition.key,
          match.to,
        );
        if (match.face) {
          this.gridEngine.turnTowards(
            this.playerCharacter.definition.key,
            match.face,
          );
        }
      }
    }

    return this;
  };

  /**
   * creates a rectangle geometry suitable for grid engine sizing
   *
   * @param x
   * @param y
   * @returns the rectangle
   */
  private _createTileRectangle = (x: number, y: number): Geom.Rectangle => {
    return new Geom.Rectangle(
      x * SCALED_TILE_SIZE,
      y * SCALED_TILE_SIZE,
      SCALED_TILE_SIZE,
      SCALED_TILE_SIZE,
    );
  };

  /**
   * toggles movement to the opposite of the current value
   *
   */
  public toggleMovement = () => {
    this.isMovementPaused = !this.isMovementPaused;
  };
}
