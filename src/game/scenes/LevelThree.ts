import {
  LEVEL_THREE_BACKGROUND_COLOR,
  LEVEL_THREE_BUFF_DEBUFF_DURATION,
  LEVEL_THREE_ENEMY_FOLLOW_RANGE,
  LEVEL_THREE_FIRE_ANIMATION_REPEAT_DELAY,
  LEVEL_THREE_FIRE_BASE_DAMAGE,
  LEVEL_THREE_FIRE_INVULNERABILITY_PERIOD,
  LEVEL_THREE_SCENE_KEY,
  ORB_LAYER_NAME,
  PLAYER_MOVED_EVENT,
  POTION_LAYER_NAME,
} from '../constants';
import {
  LevelThreeDifficulty,
  LevelThreeEnemiesDefinition,
  LevelThreeFireType,
  PotionType,
} from '../types/levelThree';
import {
  levelThreeActions,
  levelThreeSelectors,
} from '../redux/levelThreeSlice';
import {
  levelThreeCast,
  levelThreeDifficultySettingsMap,
  levelThreeEnemiesDefinition,
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

import { CharacterData } from 'grid-engine';
import { Coordinates } from '../types/position';
import { LevelScene } from './LevelScene';
import { SpriteDefinition } from '../types/assetDefinitions';
import { levelThreeMapDefinition } from '../assetDefinitions/tiles';
import { v4 as uuidv4 } from 'uuid';

export class LevelThree extends LevelScene {
  private _justHitByEnemy = false;

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
      .setPortals()
      .setCharacterLayerTransitions()
      ._setBackground()
      ._setFireBarriers()
      ._setFireColumns()
      ._setFireExplosions()
      ._setFireCollisionListeners()
      ._initializeEnemyCharacters()
      .attachKeyboardListener();

    this.dialog.init();
    this.hud.init(undefined, true);

    this.handleCloseDialog();

    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.hud.updateDimensions(gameSize);
      this.dialog.updateDimensions(gameSize);
    });

    this.hud.updateHealth(100);

    this._showDifficultyText()
      ._updateOrbText()
      ._showStarterDialog();
  };

  public update = () => {
    this.useGridPlayerControls()
      .setFacing()
      ._handlePlayerEnemyMovement();
  };

  public handlePotionConsume = (type: PotionType, coordinates: Coordinates) => {
    let taken = false;
    switch (type) {
      case PotionType.MINI_HEALTH:
      case PotionType.HEALTH:
        taken = this._takeHealthPotion(type);
        break;
      case PotionType.SPEED:
        taken = this._takeSpeedPotion();
        break;
    }

    if (!taken) {
      return;
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

    this._updateOrbText();

    this._unlockStairs();
  };

  private _takeHealthPotion = (
    type: PotionType.MINI_HEALTH | PotionType.HEALTH,
  ) => {
    const difficulty = levelThreeSelectors.selectLevelThreeDifficultySettings(
      store.getState(),
    );
    const { healthPotions } = levelThreeDifficultySettingsMap[difficulty];
    const health = levelThreeSelectors.selectLevelThreeHealth(store.getState());
    if (health === 100) {
      this.hud.updateCenterText('You already have full health!');
      this.time.delayedCall(2000, () => this.hud.updateCenterText(), [], this);
      return false;
    }

    const potionHealthValue =
      type === PotionType.MINI_HEALTH
        ? healthPotions.mini
        : healthPotions.normal;

    this._displayBuff(`+${potionHealthValue} hp`);
    storeDispatch(levelThreeActions.healthChanged(potionHealthValue));
    const currentHealth = levelThreeSelectors.selectLevelThreeHealth(
      store.getState(),
    );
    this.hud.updateHealth(currentHealth);
    return true;
  };

  private _takeSpeedPotion = () => {
    const baseModifier = 1;

    const difficulty = levelThreeSelectors.selectLevelThreeDifficultySettings(
      store.getState(),
    );
    const {
      player: { speedMod, speedDuration },
    } = levelThreeDifficultySettingsMap[difficulty];

    this.setSpeedModifier(speedMod);
    this._displayBuff(`${speedMod}x speed for ${speedDuration / 1000} seconds`);
    setTimeout(() => {
      this.setSpeedModifier(baseModifier);
      this._displayDebuff('-speed buff');
    }, speedDuration);
    return true;
  };

  private _displayBuff = (value: string) => {
    this.hud.addBuffText(value, LEVEL_THREE_BUFF_DEBUFF_DURATION);
  };

  private _displayDebuff = (value: string) => {
    this.hud.addDebuffText(value, LEVEL_THREE_BUFF_DEBUFF_DURATION);
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
    const difficulty = levelThreeSelectors.selectLevelThreeDifficultySettings(
      store.getState(),
    );
    const {
      fire: { speedModifier },
    } = levelThreeDifficultySettingsMap[difficulty];

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
    const difficulty = levelThreeSelectors.selectLevelThreeDifficultySettings(
      store.getState(),
    );
    const {
      fire: { damageModifier },
    } = levelThreeDifficultySettingsMap[difficulty];

    this._dealDamage(LEVEL_THREE_FIRE_BASE_DAMAGE * damageModifier);
  };

  private _dealDamage = (amount: number, isCrit: boolean = false) => {
    const currTime = new Date();
    const prevTime = levelThreeSelectors.selectLevelThreeLastDamageTimestamp(
      store.getState(),
    );
    const difference = currTime.getTime() - new Date(prevTime).getTime(); // be fair and only damage at most every 1 second

    if (difference < LEVEL_THREE_FIRE_INVULNERABILITY_PERIOD) {
      return;
    }

    this._displayDebuff(`-${amount}hp${isCrit ? ' (critical hit)' : ''}`);
    storeDispatch(levelThreeActions.healthChanged(-amount));
    const currentHealth = levelThreeSelectors.selectLevelThreeHealth(
      store.getState(),
    );
    this.hud.updateHealth(currentHealth);
    if (currentHealth <= 0) {
      this._handleDeath();
    }
    setTimeout(
      () => (this._justHitByEnemy = false),
      LEVEL_THREE_FIRE_INVULNERABILITY_PERIOD,
    );
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
    this.hud.updateCenterText('You died!');

    const playerIsDead = levelThreeSelectors.selectLevelThreePlayerIsDead(
      store.getState(),
    );

    if (playerIsDead) return;
    storeDispatch(levelThreeActions.levelRestarted());
    this._restartLevel();
  };

  private _initializeEnemyCharacters = () => {
    const enemies: CharacterData[] = this._createEnemyGridEngineCharacters(
      levelThreeEnemiesDefinition,
    );

    const keys: string[] = [];

    enemies.forEach(e => {
      this.gridEngine.addCharacter(e);
      this.gridEngine.moveRandomly(e.id, 1000 + 1000 * Math.random() * 1, 4);
      keys.push(e.id);
    });

    storeDispatch(levelThreeActions.enemiesChanged(keys));
    return this;
  };

  private _createEnemyGridEngineCharacters = (
    enemiesDefinition: LevelThreeEnemiesDefinition,
  ) => {
    const { options, startingSpeed, locations } = enemiesDefinition;
    const difficulty = levelThreeSelectors.selectLevelThreeDifficultySettings(
      store.getState(),
    );
    const { enemy } = levelThreeDifficultySettingsMap[difficulty];

    return locations.map(l => {
      const randomCharacterNumber = Math.floor(Math.random() * options.length);
      const definition = options[randomCharacterNumber];
      const sprite = this.add
        .sprite(0, 0, definition.key)
        .setScale(definition.scale);

      return {
        id: uuidv4(),
        startPosition: {
          x: l.x,
          y: l.y,
        },
        speed: startingSpeed * enemy.speedMod,
        sprite,
        walkingAnimationMapping: definition.walkingAnimationMapping,
      };
    });
  };

  private _handlePlayerEnemyMovement = () => {
    if (this._justHitByEnemy) return;
    const { definition } = this.playerCharacter;
    const enemyIds = levelThreeSelectors.selectLevelThreeEnemies(
      store.getState(),
    );
    if ((enemyIds ?? []).length === 0) return;

    const enemyPositions = enemyIds.map(id => ({
      id,
      pos: this.gridEngine.getPosition(id),
    }));

    const playerPos = this.gridEngine.getPosition(definition.key);

    if (
      enemyPositions.some(enemyPos =>
        this._isCharacterAdjacent(playerPos, enemyPos.pos),
      )
    ) {
      const difficulty = levelThreeSelectors.selectLevelThreeDifficultySettings(
        store.getState(),
      );
      const { enemy } = levelThreeDifficultySettingsMap[difficulty];
      let damage = 10 * enemy.damageMod;
      let isCrit = false;
      if (enemy.critsEnabled) {
        const random = Math.random() * 100;
        if (random <= 5) {
          damage *= 1.5;
          isCrit = true;
        }
      }
      this._dealDamage(damage, isCrit);
      this._justHitByEnemy = true;
    }

    return this;
  };

  private _isCharacterAdjacent = (
    player: Coordinates,
    character: Coordinates,
  ) => {
    const isAbove = player.x === character.x && player.y === character.y + 1;
    const isBelow = player.x === character.x && player.y === character.y - 1;
    const isLeft = player.x === character.x - 1 && player.y === character.y;
    const isRight = player.x === character.x + 1 && player.y === character.y;
    return isAbove || isBelow || isLeft || isRight;
  };

  public handleLevelSkip = () => {
    const confirmed = confirm(
      'Are you sure? Collecting this key will skip all the fun stuff on this level and take you straight to the treasure room.',
    );
    if (confirmed) {
      this.createNewDialog('You pick up the old key...');
      this.cameras.main.flash(1500, 0, 0, 0);
      this.gridEngine.setPosition(
        this.playerCharacter.definition.key,
        { x: 82, y: 86 },
        'ground',
      );
    }
  };

  public handleGuideInteraction = () => {
    let newDifficulty: LevelThreeDifficulty;
    const currDifficulty = levelThreeSelectors.selectLevelThreeDifficultySettings(
      store.getState(),
    );

    if (currDifficulty === LevelThreeDifficulty.NIGHTMARE) {
      newDifficulty = LevelThreeDifficulty.EASY;
    } else {
      newDifficulty = currDifficulty + 1;
    }

    const confirmed = confirm(
      'This will increase the level difficulty and restart the level',
    );

    if (confirmed) {
      const callback = () => {
        this.hud.updateCenterText(
          `${levelThreeDifficultySettingsMap[newDifficulty].friendlyName} difficulty selected`,
        );
        storeDispatch(levelThreeActions.difficultyChanged(newDifficulty));
        this._restartLevel();
      };
      this.createNewDialog(
        levelThreeDifficultySettingsMap[newDifficulty].message,
        callback,
      );
    }
  };

  private _restartLevel = () => {
    const cameraFade = 2500;
    const cameraFadeInterval = 1000;
    this.isMovementPaused = true;
    setTimeout(() => {
      this.cameras.main.fade(cameraFade, 0, 0, 0);
    }, cameraFadeInterval);
    setTimeout(() => {
      this.scene.restart();
      this.isMovementPaused = false;
    }, cameraFade + cameraFadeInterval);
  };

  private _showDifficultyText = () => {
    const difficulty = levelThreeSelectors.selectLevelThreeDifficultySettings(
      store.getState(),
    );
    const text = `${levelThreeDifficultySettingsMap[difficulty].friendlyName}`;
    this.hud.updateTopLeftText(text);

    return this;
  };

  private _updateOrbText = () => {
    const orbs = levelThreeSelectors.selectLevelThreeOrbs(store.getState());

    const count = Object.keys(orbs).reduce(
      (prevValue, currKey) => (orbs[currKey] ? prevValue + 1 : prevValue),
      0,
    );
    this.hud.updateTopCenterText(`${count}/3 orbs`);

    return this;
  };

  private _showStarterDialog = () => {
    if (this.isDev) return;
    const content = `Welcome to the Creepy Catacombs. Your goal here is simple: survive. To escape you will need to collect the three orbs scattered throughout this cursed place. But beware: there are rumors of skeletons who cause harm just by being in their presence...`;

    this.createNewDialog(content);

    return this;
  };
}
