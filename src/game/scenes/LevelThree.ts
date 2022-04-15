import {
  LEVEL_THREE_BACKGROUND_COLOR,
  LEVEL_THREE_FIRE_ANIMATION_REPEAT_DELAY,
  LEVEL_THREE_FIRE_BASE_DAMAGE,
  LEVEL_THREE_FIRE_INVULNERABILITY_PERIOD,
  LEVEL_THREE_SCENE_KEY,
  ORB_LAYER_NAME,
  POTION_LAYER_NAME,
} from '../constants';
import { LevelThreeState, PotionType } from '../types/levelThree';
import {
  levelThreeCast,
  levelThreeFireColumnLocations,
  levelThreeFireExplosionLocations,
  levelThreeInitialState,
  orbMap,
} from '../cast/levelThree';
import {
  levelThreeFireExplosionDefinition,
  levelthreeFireColumnDefinition,
} from '../assetDefinitions/sprites';

import { Coordinates } from '../types/position';
import { LevelScene } from './LevelScene';
import { levelThreeMapDefinition } from '../assetDefinitions/tiles';

export class LevelThree extends LevelScene {
  private _state: LevelThreeState = { ...levelThreeInitialState };

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

    this._state = {
      ...this._state,
      orbs: {
        ...this._state.orbs,
        [orb]: true,
      },
    };

    this._unlockStairs();
  };

  private _takeHealthPotion = (isMini: boolean = false) => {
    const { healthPotions } = this._state.difficultySettings;
    const potionHealthValue = isMini
      ? healthPotions.mini
      : healthPotions.normal;
    const healedAmount = this._state.health + potionHealthValue;
    const health = healedAmount > 100 ? 100 : healedAmount;
    this._state = {
      ...this._state,
      health,
    };
    console.log(healedAmount);
    console.log(this._state);
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
    const { orbs } = this._state;
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
          this._onFireAnimationStart(sprite, animationLengthMs),
        )
        .on('animationrepeat', () =>
          this._onFireAnimationRepeat(sprite, animationLengthMs, position),
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
          this._onFireAnimationStart(sprite, animationLengthMs),
        )
        .on('animationrepeat', () =>
          this._onFireAnimationRepeat(sprite, animationLengthMs, position),
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

  private _onFireAnimationStart = (
    sprite: Phaser.GameObjects.Sprite,
    animationLength: number,
  ) => {
    sprite.setVisible(true);
    this._state.fireIsActive = true;
    setTimeout(() => sprite.setVisible(false), animationLength);
  };

  private _onFireAnimationRepeat = (
    sprite: Phaser.GameObjects.Sprite,
    animationLength: number,
    position: Coordinates,
  ) => {
    this._state.fireIsActive = true;
    sprite.setVisible(true);
    if (this._isStandingInActiveFire(position)) {
      this._dealFireDamage();
    }

    // do damage to the player if they are in it,
    // but only once per LEVEL_THREE_FIRE_INVULNERABILITY_PERIOD
    const interval = setInterval(() => {
      if (this._isStandingInActiveFire(position)) {
        this._dealFireDamage();
      }
    }, LEVEL_THREE_FIRE_INVULNERABILITY_PERIOD);

    setTimeout(() => {
      clearInterval(interval);
      this._state.fireIsActive = false;
      sprite.setVisible(false);
    }, animationLength);
  };

  private _createDamagingFireAnimation = (
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
      // delay changes based on current difficulty
      repeatDelay:
        LEVEL_THREE_FIRE_ANIMATION_REPEAT_DELAY *
        this._state.difficultySettings.fire.speedModifier,
    });

    return this;
  };

  private _dealFireDamage = () => {
    const damage =
      LEVEL_THREE_FIRE_BASE_DAMAGE *
      this._state.difficultySettings.fire.damageModifier;
    this._dealDamage(damage);
  };

  private _dealDamage = (amount: number) => {
    // handle less than 0 health
    const newHealth = this._state.health - amount;
    if (newHealth <= 0) {
      console.log('u ded');
    }
    this._state.health = newHealth;
    console.log(newHealth);
  };

  private _setFireCollisionListeners = () => {
    this.gridEngine
      .steppedOn(
        [this.playerCharacter.definition.key],
        [...levelThreeFireColumnLocations, ...levelThreeFireExplosionLocations],
      )
      .subscribe(({ enterTile }) => {
        this._state.steppedOnFire = {
          x: enterTile.x,
          y: enterTile.y,
        };
        if (this._state.fireIsActive) {
          this._dealFireDamage();
        }
      });

    this.gridEngine.positionChangeStarted().subscribe(({ charId }) => {
      if (charId === this.playerCharacter.definition.key) {
        this._state.steppedOnFire = undefined;
      }
    });

    return this;
  };

  private _isStandingInActiveFire = (position: Coordinates) =>
    this._state.steppedOnFire &&
    this._state.steppedOnFire.x === position.x &&
    this._state.steppedOnFire.y === position.y;
}
