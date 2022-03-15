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

const player: PlayerCharacter = {
  definition: playerSpriteDefinition,
  startingX: 15,
  startingY: 95,
  startingSpeed: 4,
};

const catInteraction: PerformInteraction = params => {
  const text = 'Meow meow!';

  params.createNewDialog(text);
};

const npcs: NpcCharacter[] = [
  {
    definition: gregSpriteDefinition,
    startingX: 25,
    startingY: 42,
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
    handler: params => alert('pc used'),
    friendlyName: `Greg's battlestation`,
  },
  {
    x: 10,
    y: 91,
    handler: params => alert('diploma used'),
    friendlyName: 'college diploma',
  },
  {
    x: 12,
    y: 90,
    handler: params => alert('diploma used'),
    friendlyName: 'college diploma',
  },
  {
    x: 20,
    y: 92,
    handler: params => params.createNewDialog('bio  used'),
    friendlyName: 'musings',
  },
  {
    x: 23,
    y: 92,
    handler: params => params.createNewDialog('sweet nectar of the gods!'),
    friendlyName: 'black gold',
  },
];
const portals: PortalDefinition[] = [
  {
    from: {
      x: 16,
      y: 9,
    },
    type: PortalType.SCENE,
    to: '', // TODO: scene 2,
    dialog: 'the portal hums with magical energy as you approach...',
    friendlyName: 'leftmost portal',
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
  },
  {
    from: [
      { x: 46, y: 77 },
      { x: 46, y: 76 },
    ],
    to: { x: 17, y: 91 },
    friendlyName: 'go downstairs',
  },
];

export const levelOneCast: LevelCast = {
  player,
  npcs,
  items,
  portals,
  doors,
};
