import {
  HUD_INITIALIZED_EVENT,
  UPDATE_HEALTH_EVENT,
  UPDATE_UNLOCKED_FEATURES_EVENT,
} from '../ui/events';
import {
  LEVEL_FOUR_JUMP_VELOCITY,
  LEVEL_FOUR_PLAYER_DEPTH,
  LEVEL_FOUR_SCENE_KEY,
  LEVEL_FOUR_WALK_VELOCITY,
  TILE_SIZE,
  WASD_KEY_STRING,
} from '../constants';
import { Scene, Tilemaps } from 'phaser';
import { levelFourAnimations, levelFourLayers } from '../cast/levelFour';
import { store, storeDispatch } from '../redux/store';

import AnimatedTilesPlugin from 'phaser-animated-tiles-phaser3.5';
import { OverlayContentKey } from '../types/overlayContent';
import { TileMapDefinition } from '../types/assetDefinitions';
import { UIEventEmitter } from '../ui/eventEmitter';
import { createAnimation } from '../helpers/createAnimation';
import { levelFourMapDefinition } from '../assetDefinitions/tiles';
import { loadUnlockedFeatures } from '../helpers/localStorage';
import { overlayActions } from '../redux/overlaySlice';
import { playerSpriteDefinition } from '../assetDefinitions/sprites';

const START_X = 0;
const START_Y = 34;
// const START_X = 0;
// const START_Y = 25;
// const START_X = 74;
// const START_Y = 51;

export class LevelFour extends Scene {
  public uiEventEmitter: UIEventEmitter;
  public animatedTiles: AnimatedTilesPlugin;
  public player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  private _map: Tilemaps.Tilemap | null = null;
  private _mapDefinition: TileMapDefinition;
  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private _wasd: object;

  constructor() {
    super(LEVEL_FOUR_SCENE_KEY);
    this._mapDefinition = levelFourMapDefinition;
  }

  public create = (uiEventEmitter: UIEventEmitter) => {
    // set map and player character
    this._setMap()._setPlayer();

    // set map layers
    const tilesets = this._addMapTilesets();
    this._createMapLayers(tilesets);

    // set cursors
    this._setCursors();
    this._setWasd();

    // set camera
    this._setCamera();

    // create animations
    this._createAnimations();

    this.uiEventEmitter = uiEventEmitter;
    this._initializeHUD();
  };

  public update = () => {
    this._handlePlayerMovement();
  };

  private _initializeHUD = () => {
    this.time.delayedCall(
      100,
      () => {
        const unlockedFeatures = this._loadUnlockedFeatures();
        this.uiEventEmitter.emit(
          HUD_INITIALIZED_EVENT,
          true,
          true,
          true,
          false,
        );
        this.uiEventEmitter.emit(UPDATE_HEALTH_EVENT, 100);
        this.uiEventEmitter.emit(
          UPDATE_UNLOCKED_FEATURES_EVENT,
          unlockedFeatures,
          {
            inventory: () => this.createOverlay(OverlayContentKey.PROJECTS),
            quests: () => this.createOverlay(OverlayContentKey.EXPERIENCES),
            talents: () => this.createOverlay(OverlayContentKey.SKILLS),
          },
        );
      },
      [],
      this,
    );
  };

  private _setMap = () => {
    this._map = this.make.tilemap({
      key: this._mapDefinition.key,
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
    });
    this.animatedTiles.init(this._map);

    return this;
  };

  private _setPlayer = () => {
    if (!this._map) return;

    const startPosition = this._map.tileToWorldXY(START_X, START_Y);

    this.player = this.physics.add
      .sprite(startPosition.x, startPosition.y, playerSpriteDefinition.key)
      .setCollideWorldBounds(true)
      .setDepth(LEVEL_FOUR_PLAYER_DEPTH);

    this.player.body.setSize(this.player.width * 0.8, this.player.height, true);

    return this;
  };

  private _addMapTilesets = () => {
    const tilesets: string[] = [];

    this._mapDefinition.tilesets.forEach(ts => {
      this._map.addTilesetImage(ts.name, ts.key);
      tilesets.push(ts.name);
    });

    return tilesets;
  };

  private _createMapLayers = (tilesets: string[]) => {
    if (!this._map || !this.player) return;

    this._map.layers.forEach((l, i) => {
      const layer = this._map.createLayer(i, tilesets, 0, 0).setDepth(10);
      const definedLayer = levelFourLayers[l.name];
      if (definedLayer) {
        const { depth, configure } = definedLayer;
        if (depth) {
          layer.setDepth(depth);
        }

        if (configure) {
          configure(layer, this);
        }
      }
    });

    return this;
  };

  private _setCursors = () => {
    this._cursors = this.input.keyboard.createCursorKeys();
    return this;
  };

  private _setWasd = () => {
    this._wasd = this.input.keyboard.addKeys(WASD_KEY_STRING);
    return this;
  };

  private _setCamera = () => {
    if (!this._map || !this.player) return;

    this.cameras.main
      .setBounds(0, 0, this._map.widthInPixels, this._map.heightInPixels)
      .startFollow(this.player)
      .setZoom(2.5);

    return this;
  };

  private _createAnimations = () => {
    this._createPlayerAnimations();

    return this;
  };

  private _createPlayerAnimations = () => {
    createAnimation(
      this,
      levelFourAnimations['walk'],
      playerSpriteDefinition.key,
    );
    createAnimation(
      this,
      levelFourAnimations['idle'],
      playerSpriteDefinition.key,
    );
  };

  private _handlePlayerMovement = () => {
    if (!this.player) return;

    if (this._cursors.left.isDown || this._wasd['A'].isDown) {
      this.player.body.setVelocityX(-LEVEL_FOUR_WALK_VELOCITY);
      this.player.anims.play(levelFourAnimations['walk'].key, true);
      this.player.flipX = true;
    } else if (this._cursors.right.isDown || this._wasd['D'].isDown) {
      this.player.body.setVelocityX(LEVEL_FOUR_WALK_VELOCITY);
      this.player.anims.play(levelFourAnimations['walk'].key, true);
      this.player.flipX = false;
    } else {
      this.player.body.setVelocityX(0);
      this.player.anims.play(levelFourAnimations['idle'].key);
    }
    if (
      (this._cursors.up.isDown || this._wasd['W'].isDown) &&
      this.player.body.onFloor()
    ) {
      this.player.body.setVelocityY(-LEVEL_FOUR_JUMP_VELOCITY);
    }

    if (!this.player.body.onFloor()) {
      this.player.anims.pause();
    }
  };

  public handleLavaCollision = () => {
    this.player.body.setVelocityY(-LEVEL_FOUR_JUMP_VELOCITY);
  };

  private _loadUnlockedFeatures = () => {
    const unlockedFeatures = loadUnlockedFeatures();
    if (unlockedFeatures) {
      storeDispatch(overlayActions.updateUnlockedFeatures(unlockedFeatures));
    }

    return unlockedFeatures;
  };

  public createOverlay = (contentKey: OverlayContentKey) => {
    this.scene.pause();
    store.dispatch(
      overlayActions.overlayOpened({
        contentKey,
        pausedScene: this.scene.key,
      }),
    );

    return this;
  };
}
