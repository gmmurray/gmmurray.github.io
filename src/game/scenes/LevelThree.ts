import {
  LEVEL_THREE_BACKGROUND_COLOR,
  LEVEL_THREE_FIRE_ANIMATION_REPEAT_DELAY,
  LEVEL_THREE_FIRE_BASE_DAMAGE,
  LEVEL_THREE_FIRE_INVULNERABILITY_PERIOD,
  LEVEL_THREE_SCENE_KEY,
  ORB_LAYER_NAME,
  POTION_LAYER_NAME,
} from '../constants';
import { LevelThreeFireType, PotionType } from '../types/levelThree';
import {
  levelThreeActions,
  levelThreeSelectors,
} from '../redux/levelThreeSlice';
import {
  levelThreeCast,
  levelThreeFireBarrierLocations,
  levelThreeFireColumnLocations,
  levelThreeFireExplosionLocations,
  orbMap,
} from '../cast/levelThree';
import {
  levelThreeFireBarrierDefinition,
  levelThreeFireExplosionDefinition,
  levelthreeFireColumnDefinition,
} from '../assetDefinitions/sprites';
import { store, storeDispatch } from '../redux/store';

import { Coordinates } from '../types/position';
import { LevelScene } from './LevelScene';
import { levelThreeMapDefinition } from '../assetDefinitions/tiles';

export class LevelThree extends LevelScene {
  constructor() {
    super(LEVEL_THREE_SCENE_KEY);
    this.levelNumber = 3;
    this.mapDefinition = levelThreeMapDefinition;
    this.cast = levelThreeCast;
  }

  public create = () => {
    this.setCharacters()
      .setItems()
      .setPortals()
      .setDoors()
      .setCamera()
      .setMap()
      .setCharacterLayerTransitions()
      ._setBackground()
      ._setFireBarriers()
      ._setFireColumns()
      ._setFireExplosions()
      ._setFireCollisionListeners()
      .attachKeyboardListener();

    this.dialog.init();
    this.hud.init();

    this.handleCloseDialog();

    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.hud.updateDimensions(gameSize);
      this.dialog.updateDimensions(gameSize);
    });
  };

  public update = () => {
    this.useGridPlayerControls().setFacing();
  };

  public handlePotionConsume = (type: PotionType, coordinates: Coordinates) => {
    switch (type) {
      case PotionType.MINI_HEALTH:
        this._takeHealthPotion(true);
        break;
      case PotionType.HEALTH:
        this._takeHealthPotion();
        break;
      case PotionType.SPEED:
        this._takeSpeedPotion();
        break;
    }
    this.map.removeTileAt(
      coordinates.x,
      coordinates.y,
      true,
      true,
      POTION_LAYER_NAME,
    );
    this.removeItem(coordinates);
  };

  public handleOrbCollection = (orb: 1 | 2 | 3) => {
    this.createNewDialog('You absorb the power of the magical orb...');

    const {
      location: { primary, all },
    } = orbMap[orb];

    all.forEach(tile =>
      this.map.removeTileAt(tile.x, tile.y, true, true, ORB_LAYER_NAME),
    );

    this.removeItem(primary);

    storeDispatch(levelThreeActions.orbCollected(orb));

    this._unlockStairs();
  };

  private _takeHealthPotion = (isMini: boolean = false) => {
    const {
      healthPotions,
    } = levelThreeSelectors.selectLevelThreeDifficultySettings(
      store.getState(),
    );

    const potionHealthValue = isMini
      ? healthPotions.mini
      : healthPotions.normal;

    storeDispatch(levelThreeActions.healthChanged(potionHealthValue));
  };

  private _takeSpeedPotion = () => {
    const baseModifier = 1;
    const enhancedModifier = 1.5;
    this.setSpeedModifier(enhancedModifier);
    setTimeout(() => {
      this.setSpeedModifier(baseModifier);
    }, 5000);
  };

  private _unlockStairs = () => {
    const orbs = levelThreeSelectors.selectLevelThreeOrbs(store.getState());
    const firstStairActive = orbs[1];
    const secondStairActive = orbs[2] && orbs[2];

    const updatedDoors = [...this.doors];
    if (firstStairActive) {
      updatedDoors[0].inactive = false;
    }

    if (secondStairActive) {
      updatedDoors[1].inactive = false;
    }

    this.doors = [...updatedDoors];
    this.setDoors();
  };

  private _setBackground = () => {
    this.cameras.main.setBackgroundColor(LEVEL_THREE_BACKGROUND_COLOR);
    return this;
  };

  private _setFireColumns = () => {
    const {
      key,
      scale,
      frameCount,
      frameRate,
    } = levelthreeFireColumnDefinition;
    const animKey = `${key}-animation`;

    levelThreeFireColumnLocations.forEach(position => {
      const sprite = this.add
        .sprite(0, 0, key)
        .setScale(scale)
        .setVisible(true);

      this._createDamagingFireAnimation(key, animKey, frameRate, {
        end: frameCount - 1,
      });

      const animationLengthMs = (frameCount / frameRate) * 1000;

      sprite
        .on('animationstart', () =>
          this._onFireAnimationStart(
            sprite,
            animationLengthMs,
            LevelThreeFireType.COLUMN,
          ),
        )
        .on('animationrepeat', () =>
          this._onFireAnimationRepeat(
            sprite,
            animationLengthMs,
            position,
            LevelThreeFireType.COLUMN,
          ),
        )
        .play(animKey);

      this.gridEngine.addCharacter({
        id: key,
        startPosition: position,
        sprite,
        collides: false,
      });
    });

    return this;
  };

  private _setFireExplosions = () => {
    const {
      key,
      scale,
      frameCount,
      frameRate,
    } = levelThreeFireExplosionDefinition;
    const animKey = `${key}-animation`;

    levelThreeFireExplosionLocations.forEach(position => {
      const sprite = this.add
        .sprite(0, 0, key)
        .setScale(scale)
        .setVisible(true);

      this._createDamagingFireAnimation(key, animKey, frameRate, {
        frames: [0, 2, 3, 5],
      });

      const animationLengthMs = (frameCount / frameRate) * 1000;

      sprite
        .on('animationstart', () =>
          this._onFireAnimationStart(
            sprite,
            animationLengthMs,
            LevelThreeFireType.EXPLOSION,
          ),
        )
        .on('animationrepeat', () =>
          this._onFireAnimationRepeat(
            sprite,
            animationLengthMs,
            position,
            LevelThreeFireType.EXPLOSION,
          ),
        )
        .play(animKey);

      this.gridEngine.addCharacter({
        id: key,
        startPosition: position,
        sprite,
        collides: false,
      });
    });

    return this;
  };

  private _setFireBarriers = () => {
    const {
      key,
      scale,
      frameCount,
      frameRate,
      offsetY,
    } = levelThreeFireBarrierDefinition;
    const animKey = `${key}-animation`;

    levelThreeFireBarrierLocations.forEach(position => {
      const sprite = this.add
        .sprite(0, 0, key)
        .setScale(scale)
        .setVisible(true);

      this._createPassiveFireAnimation(key, animKey, frameRate, {
        end: frameCount - 1,
      });

      sprite.play(animKey);

      this.gridEngine.addCharacter({
        id: key,
        startPosition: position,
        sprite,
        collides: true,
        offsetY,
      });
    });

    return this;
  };

  private _onFireAnimationStart = (
    sprite: Phaser.GameObjects.Sprite,
    animationLength: number,
    type: LevelThreeFireType,
  ) => {
    sprite.setVisible(true);
    storeDispatch(levelThreeActions.activeFiresChanged({ type, active: true }));
    setTimeout(() => sprite.setVisible(false), animationLength);
  };

  private _onFireAnimationRepeat = (
    sprite: Phaser.GameObjects.Sprite,
    animationLength: number,
    position: Coordinates,
    type: LevelThreeFireType,
  ) => {
    storeDispatch(levelThreeActions.activeFiresChanged({ type, active: true }));
    sprite.setVisible(true);

    if (this._isStandingInActiveFire(position, type)) {
      this._dealFireDamage();
    }

    // do damage to the player if they are in it,
    // but only once per LEVEL_THREE_FIRE_INVULNERABILITY_PERIOD
    const interval = setInterval(() => {
      if (this._isStandingInActiveFire(position, type)) {
        this._dealFireDamage();
      }
    }, LEVEL_THREE_FIRE_INVULNERABILITY_PERIOD);

    setTimeout(() => {
      clearInterval(interval);
      storeDispatch(
        levelThreeActions.activeFiresChanged({ type, active: false }),
      );
      sprite.setVisible(false);
    }, animationLength);
  };

  private _createDamagingFireAnimation = (
    key: string,
    animKey: string,
    frameRate: number,
    frameConfig: Phaser.Types.Animations.GenerateFrameNumbers,
  ) => {
    const {
      fire: { speedModifier },
    } = levelThreeSelectors.selectLevelThreeDifficultySettings(
      store.getState(),
    );

    this.anims.create({
      key: animKey,
      frameRate,
      frames: this.anims.generateFrameNumbers(key, frameConfig),
      repeat: -1,
      // delay changes based on current difficulty
      repeatDelay: LEVEL_THREE_FIRE_ANIMATION_REPEAT_DELAY * speedModifier,
    });

    return this;
  };

  private _createPassiveFireAnimation = (
    key: string,
    animKey: string,
    frameRate: number,
    frameConfig: Phaser.Types.Animations.GenerateFrameNumbers,
  ) => {
    this.anims.create({
      key: animKey,
      frameRate,
      frames: this.anims.generateFrameNumbers(key, frameConfig),
      repeat: -1,
    });

    return this;
  };

  private _dealFireDamage = () => {
    const {
      fire: { damageModifier },
    } = levelThreeSelectors.selectLevelThreeDifficultySettings(
      store.getState(),
    );

    this._dealDamage(LEVEL_THREE_FIRE_BASE_DAMAGE * damageModifier);
  };

  private _dealDamage = (amount: number) => {
    storeDispatch(levelThreeActions.healthChanged(-amount));
    const currentHealth = levelThreeSelectors.selectLevelThreeHealth(
      store.getState(),
    );
    if (currentHealth <= 0) {
      this._handleDeath();
    }
  };

  private _setFireCollisionListeners = () => {
    this.gridEngine
      .steppedOn(
        [this.playerCharacter.definition.key],
        levelThreeFireColumnLocations,
      )
      .subscribe(({ enterTile }) => {
        storeDispatch(
          levelThreeActions.standingInFireChanged({
            x: enterTile.x,
            y: enterTile.y,
          }),
        );
        const isActive = levelThreeSelectors.selectLevelThreeActiveFires(
          store.getState(),
        );

        if (isActive[LevelThreeFireType.COLUMN]) {
          this._dealFireDamage();
        }
      });

    this.gridEngine
      .steppedOn(
        [this.playerCharacter.definition.key],
        levelThreeFireExplosionLocations,
      )
      .subscribe(({ enterTile }) => {
        storeDispatch(
          levelThreeActions.standingInFireChanged({ ...enterTile }),
        );
        const isActive = levelThreeSelectors.selectLevelThreeActiveFires(
          store.getState(),
        );
        if (isActive[LevelThreeFireType.EXPLOSION]) {
          this._dealFireDamage();
        }
      });

    this.gridEngine.positionChangeStarted().subscribe(({ charId }) => {
      if (charId === this.playerCharacter.definition.key) {
        storeDispatch(levelThreeActions.standingInFireChanged(undefined));
      }
    });

    return this;
  };

  private _isStandingInActiveFire = (
    position: Coordinates,
    type: LevelThreeFireType,
  ) => {
    const isActive = levelThreeSelectors.selectLevelThreeActiveFires(
      store.getState(),
    );
    const location = levelThreeSelectors.selectLevelThreeStandingInFire(
      store.getState(),
    );

    return (
      isActive[type] &&
      location &&
      location.x === position.x &&
      location.y === position.y
    );
  };

  private _handleDeath = () => {
    // hud message TODO:
    const playerIsDead = levelThreeSelectors.selectLevelThreePlayerIsDead(
      store.getState(),
    );

    if (playerIsDead) return;
    const cameraFade = 2500;
    const cameraFadeInterval = 1000;
    this.isMovementPaused = true;
    storeDispatch(levelThreeActions.playerDied());
    setTimeout(() => {
      this.cameras.main.fade(cameraFade, 0, 0, 0);
    }, cameraFadeInterval);
    setTimeout(() => {
      this.scene.restart();
      this.isMovementPaused = false;
    }, cameraFade + cameraFadeInterval);
  };
}
