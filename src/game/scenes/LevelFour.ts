import {
  ADD_DEBUFF_EVENT,
  HUD_INITIALIZED_EVENT,
  HUD_SHUTDOWN_EVENT,
  UPDATE_CENTER_TEXT_EVENT,
  UPDATE_HEALTH_EVENT,
  UPDATE_UNLOCKED_FEATURES_EVENT,
} from '../ui/events';
import {
  INVENTORY_PHASER_EVENT_KEY,
  LEVEL_FOUR_BATTLE_TEXT_DURATION,
  LEVEL_FOUR_DAMAGE_DELAY_MS,
  LEVEL_FOUR_ENEMY_WALK_VELOCITY,
  LEVEL_FOUR_JUMP_VELOCITY,
  LEVEL_FOUR_PLAYER_DEPTH,
  LEVEL_FOUR_SCENE_KEY,
  LEVEL_FOUR_WALK_VELOCITY,
  QUESTS_PHASER_EVENT_KEY,
  TALENTS_PHASER_EVENT_KEY,
  TILE_SIZE,
  WASD_KEY_STRING,
} from '../constants';
import { LevelFourEnemy, LevelFourEnemyDefinition } from '../types/levelFour';
import { Scene, Tilemaps } from 'phaser';
import {
  levelFourAnimations,
  levelFourEnemies,
  levelFourLayers,
} from '../cast/levelFour';
import { store, storeDispatch } from '../redux/store';

import AnimatedTilesPlugin from 'phaser-animated-tiles-phaser3.5';
import { OverlayContentKey } from '../types/overlayContent';
import { TileMapDefinition } from '../types/assetDefinitions';
import { UIEventEmitter } from '../ui/eventEmitter';
import { UnlockedFeatures } from '../types/savedData';
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
  public enemies: Record<string, LevelFourEnemy>;

  private _map: Tilemaps.Tilemap | null = null;
  private _mapDefinition: TileMapDefinition;
  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private _wasd: object;
  private _unlockedFeatures: UnlockedFeatures;

  // state
  private _playerHealth = 100;
  private _invulnerable = false;

  constructor() {
    super(LEVEL_FOUR_SCENE_KEY);
    this._mapDefinition = levelFourMapDefinition;
  }

  public create = (uiEventEmitter: UIEventEmitter) => {
    // set map and player character
    this._setMap()._setPlayer();

    this._setEnemies();

    // set map layers
    const tilesets = this._addMapTilesets();
    this._createMapLayers(tilesets);

    // set cursors
    this._setCursors();
    this._setWasd();
    this._setUIKeybinds();

    // set camera
    this._setCamera();

    // create animations
    this._createAnimations();

    this.uiEventEmitter = uiEventEmitter;
    this._initializeHUD();
  };

  public update = () => {
    this._handlePlayerMovement();
    this._moveEnemy('enemy-1');
  };

  private _initializeHUD = () => {
    this.time.delayedCall(
      100,
      () => {
        const unlockedFeatures = this._loadUnlockedFeatures();
        this.uiEventEmitter.emit(HUD_INITIALIZED_EVENT, true, true, true, true);
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

  private _setEnemies = () => {
    if (!this._map) return;

    if (!this.enemies) {
      this.enemies = {};
    }

    levelFourEnemies.forEach(lfe => {
      const startPosition = this._map!.tileToWorldXY(
        lfe.startPos.x,
        lfe.startPos.y,
      );

      this.enemies[lfe.id] = {
        sprite: this.physics.add
          .sprite(startPosition.x, startPosition.y, lfe.textureKey)
          .setCollideWorldBounds(true)
          .setDepth(LEVEL_FOUR_PLAYER_DEPTH)
          .setImmovable(true),
        definition: lfe,
        mapBounds: {
          left: this._map!.tileToWorldX(lfe.bounds.left),
          right: this._map!.tileToWorldX(lfe.bounds.right),
        },
      };

      this.enemies[lfe.id].sprite.body.setSize(
        this.enemies[lfe.id].sprite.width * 0.8,
        this.enemies[lfe.id].sprite.height * 0.8,
        true,
      );

      this.physics.add.collider(this.enemies[lfe.id].sprite, this.player, () =>
        this.dealDamage(lfe.damage),
      );
    });
  };

  private _addMapTilesets = () => {
    const tilesets: string[] = [];

    this._mapDefinition.tilesets.forEach(ts => {
      this._map?.addTilesetImage(ts.name, ts.key);
      tilesets.push(ts.name);
    });

    return tilesets;
  };

  private _createMapLayers = (tilesets: string[]) => {
    if (!this._map || !this.player) return;

    this._map.layers.forEach((l, i) => {
      const layer = this._map?.createLayer(i, tilesets, 0, 0).setDepth(10);
      const definedLayer = levelFourLayers[l.name];
      if (definedLayer && layer) {
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

  private _setUIKeybinds = () => {
    const callback = (event: any) => {
      const { inventory, questLog, talentTree } = this._unlockedFeatures ?? {};
      if (event.key === INVENTORY_PHASER_EVENT_KEY && inventory) {
        this.createOverlay(OverlayContentKey.PROJECTS);
      }

      if (event.key === QUESTS_PHASER_EVENT_KEY && questLog) {
        this.createOverlay(OverlayContentKey.EXPERIENCES);
      }

      if (event.key === TALENTS_PHASER_EVENT_KEY && talentTree) {
        this.createOverlay(OverlayContentKey.SKILLS);
      }
    };

    this.input.keyboard.on('keydown', callback, this);
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
    //this._createPlayerAnimations();
    Object.keys(levelFourAnimations).forEach(spriteKey => {
      Object.keys(levelFourAnimations[spriteKey]).forEach(animationKey => {
        createAnimation(
          this,
          levelFourAnimations[spriteKey][animationKey],
          spriteKey,
        );
      });
    });

    return this;
  };

  // private _createPlayerAnimations = () => {
  //   createAnimation(
  //     this,
  //     levelFourAnimations['walk'],
  //     playerSpriteDefinition.key,
  //   );
  //   createAnimation(
  //     this,
  //     levelFourAnimations['idle'],
  //     playerSpriteDefinition.key,
  //   );
  // };

  private _handlePlayerMovement = () => {
    if (!this.player) return;

    if (this._cursors.left.isDown || this._wasd['A'].isDown) {
      this.player.body.setVelocityX(-LEVEL_FOUR_WALK_VELOCITY);
      this.player.anims.play(levelFourAnimations['player']['walk'].key, true);
      this.player.flipX = true;
    } else if (this._cursors.right.isDown || this._wasd['D'].isDown) {
      this.player.body.setVelocityX(LEVEL_FOUR_WALK_VELOCITY);
      this.player.anims.play(levelFourAnimations['player']['walk'].key, true);
      this.player.flipX = false;
    } else {
      this.player.body.setVelocityX(0);
      this.player.anims.play(levelFourAnimations['player']['idle'].key);
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

  private _moveEnemy = (id: string) => {
    if (!this._map || !this.enemies[id]) return;

    // if enemy is at left bound, move right
    if (this.enemies[id].sprite.x <= this.enemies[id].mapBounds.left) {
      this.enemies[id].sprite.body.setVelocityX(LEVEL_FOUR_ENEMY_WALK_VELOCITY);
    } else if (this.enemies[id].sprite.x >= this.enemies[id].mapBounds.right) {
      // if enemy is at right bound, move left
      this.enemies[id].sprite.body.setVelocityX(
        -LEVEL_FOUR_ENEMY_WALK_VELOCITY,
      );
    }
  };

  public handleLavaCollision = () => {
    this.player.body.setVelocityY(-LEVEL_FOUR_JUMP_VELOCITY);
    this.dealDamage(10);
  };

  private _loadUnlockedFeatures = () => {
    const unlockedFeatures = loadUnlockedFeatures();
    if (unlockedFeatures) {
      this._unlockedFeatures = {
        ...(unlockedFeatures as UnlockedFeatures),
      };
      storeDispatch(overlayActions.updateUnlockedFeatures(unlockedFeatures));
    }

    return this._unlockedFeatures;
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

  public dealDamage = (value: number) => {
    if (this._invulnerable) return;
    this.uiEventEmitter.emit(
      ADD_DEBUFF_EVENT,
      `-${value} hp`,
      LEVEL_FOUR_BATTLE_TEXT_DURATION,
    );
    this._changeHealth(-value);
    this._invulnerable = true;
    this.time.delayedCall(
      LEVEL_FOUR_DAMAGE_DELAY_MS,
      () => {
        this._invulnerable = false;
      },
      [],
      this,
    );
  };

  private _changeHealth = (value: number) => {
    let newHealth = this._playerHealth + value;
    if (newHealth < 0) {
      newHealth = 0;
    }

    if (newHealth > 100) {
      newHealth = 100;
    }

    this._playerHealth = newHealth;
    this.uiEventEmitter.emit(UPDATE_HEALTH_EVENT, this._playerHealth);

    if (this._playerHealth <= 0) {
      this._handleDeath();
    }
  };

  private _handleDeath = () => {
    this.cameras.main.setAlpha(0.5);
    this.scene.pause();
    this.uiEventEmitter.emit(UPDATE_CENTER_TEXT_EVENT, 'You died!');
    setTimeout(() => {
      this.scene.restart();
      this._playerHealth = 100;
      this.uiEventEmitter.emit(HUD_SHUTDOWN_EVENT);
    }, 2500);
  };
}
