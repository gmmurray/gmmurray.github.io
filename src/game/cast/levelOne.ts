import { BASE_PLAYER_SPEED, LEVEL_TWO_SCENE_KEY } from '../constants';
import {
  DoorDefinition,
  ItemDefinition,
  LevelCast,
  NpcCharacter,
  PerformInteraction,
  PlayerCharacter,
  PortalDefinition,
  PortalType,
} from '../types/interactions';
import {
  gregSpriteDefinition,
  greyCatSpriteDefinition,
  playerSpriteDefinition,
  whiteCatSpriteDefinition,
} from '../assetDefinitions/sprites';

import { Direction } from 'grid-engine';
import { OverlayContentKey } from '../types/overlayContent';
import { createOverlay } from '../helpers/createOverlay';
import { overlayActions } from '../redux/overlaySlice';
import { store } from '../redux/store';

const player: PlayerCharacter = {
  definition: playerSpriteDefinition,
  // startingX: 24,
  // startingY: 52,
  startingX: 15,
  startingY: 96,
  startingSpeed: BASE_PLAYER_SPEED,
};

const catInteraction: PerformInteraction = params => {
  const text = 'Meow meow!';

  params.createNewDialog(text);
};

const npcs: NpcCharacter[] = [
  {
    definition: gregSpriteDefinition,
    startingX: 24,
    startingY: 43,
    startingSpeed: 4,
    friendlyName: 'Greg',
    handler: params => {
      const text = `Hello and welcome to my game! I am Greg and I am here to help you explore this world. You've already learned how to interact with people and things (space or enter) and you can use the arrow keys to move. Feel free to explore the area but stop by my house before heading out of town!`;

      params.createNewDialog(text);
    },
    radius: 4,
  },
  {
    definition: greyCatSpriteDefinition,
    startingX: 7,
    startingY: 93,
    startingSpeed: 2,
    friendlyName: 'Khufu',
    handler: params => catInteraction(params),
    radius: 2,
  },
  {
    definition: whiteCatSpriteDefinition,
    startingX: 23,
    startingY: 95,
    startingSpeed: 2,
    friendlyName: 'Dre',
    handler: params => catInteraction(params),
    radius: 2,
  },
];

const items: ItemDefinition[] = [
  {
    x: 7,
    y: 91,
    handler: params => createOverlay(OverlayContentKey.SKILLS, params.scene),
    friendlyName: `Greg's battlestation`,
  },
  {
    x: 10,
    y: 91,
    handler: params => createOverlay(OverlayContentKey.UNF, params.scene),
    friendlyName: 'college diploma',
  },
  {
    x: 12,
    y: 90,
    handler: params => createOverlay(OverlayContentKey.UF, params.scene),
    friendlyName: 'college diploma',
  },
  {
    x: 20,
    y: 92,
    handler: params => createOverlay(OverlayContentKey.BIO, params.scene),
    friendlyName: 'musings',
  },
  {
    x: 23,
    y: 92,
    handler: params => params.createNewDialog('sweet nectar of the gods!'),
    friendlyName: 'black gold',
  },
  {
    x: 38,
    y: 76,
    handler: params =>
      params.createNewDialog(
        'you power on the Game Cube. what will you play today, Super Smash Bros Melee or Mario Kart Double Dash?',
      ),
    friendlyName: 'game cube',
  },
  {
    x: 40,
    y: 75,
    handler: params => params.createNewDialog('a wild Magikarp appears!'),
    friendlyName: 'fish tank',
  },
  {
    x: 44,
    y: 78,
    handler: params =>
      params.createNewDialog(`I can't even remember what I bought...`),
    friendlyName: 'packages',
  },
  {
    x: 23,
    y: 34,
    handler: ({ createNewDialog }) =>
      createNewDialog(`LEFT: Greg's house. STRAIGHT: Portal Pond`),
    friendlyName: 'sign post',
  },
];
const portals: PortalDefinition[] = [
  {
    from: {
      x: 16,
      y: 9,
    },
    type: PortalType.SCENE,
    to: LEVEL_TWO_SCENE_KEY,
    dialog: 'the portal hums with magical energy as you approach...',
    friendlyName: 'Mysterious Forest',
  },
  {
    from: {
      x: 28,
      y: 9,
    },
    type: PortalType.SCENE,
    to: '', // TODO: scene 3,
    dialog: 'the portal hums with magical energy as you approach...',
    friendlyName: 'middle',
  },
  {
    from: {
      x: 40,
      y: 9,
    },
    type: PortalType.SCENE,
    to: '', // TODO: scene 4,
    dialog: 'the portal hums with magical energy as you approach...',
    friendlyName: 'rightmost portal',
  },
];
const doors: DoorDefinition[] = [
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
  {
    from: [{ x: 18, y: 91 }],
    to: { x: 46, y: 78 },
    friendlyName: 'go upstairs',
    face: Direction.DOWN,
  },
  {
    from: [
      { x: 46, y: 77 },
      { x: 46, y: 76 },
    ],
    to: { x: 17, y: 91 },
    friendlyName: 'go downstairs',
    face: Direction.LEFT,
  },
];

export const levelOneCast: LevelCast = {
  player,
  npcs,
  items,
  portals,
  doors,
};
