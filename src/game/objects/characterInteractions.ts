import {
  InteractionLookup,
  InteractionOperation,
  PerformInteraction,
} from '../types/interactions';
import {
  gregSpriteDefinition,
  greyCatSpriteDefinition,
  whiteCatSpriteDefinition,
} from '../assetDefinitions/sprites';

import { Direction } from 'grid-engine';

const interactionLookup: InteractionLookup = {
  [gregSpriteDefinition.key]: params => gregInteraction(params),
  [greyCatSpriteDefinition.key]: params => catInteraction(params),
  [whiteCatSpriteDefinition.key]: params => catInteraction(params),
};

export const performCharacterInteraction: InteractionOperation = (
  id,
  params,
) => {
  const interaction = interactionLookup[id];

  if (!interaction) return;

  interaction(params);
};

const gregInteraction: PerformInteraction = params => {
  const { scene } = params;
  const text = `Hello and welcome to my game! I am Greg and I am here to help you explore this world. You've already learned how to interact with people and things (space or enter) and you can use the arrow keys to move. Feel free to explore the area but stop by my house before heading out of town!`;

  scene.createNewDialog(text);
};

const catInteraction: PerformInteraction = params => {
  const { scene } = params;
  const text = 'Meow meow!';

  scene.createNewDialog(text);
};
