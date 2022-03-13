import {
  InteractionLookup,
  InteractionOperation,
  PerformInteraction,
} from '../types/interactions';

import { playerSpriteDefinition } from '../assetDefinitions/sprites';

const interactionLookup: InteractionLookup = {
  ['11927']: params => door11927(params),
};

export const performDoorInteraction: InteractionOperation = (id, params) => {
  const interaction = interactionLookup[id];

  if (!interaction) return;

  interaction(params);
};

const door11927: PerformInteraction = params => {
  params.scene.gridEngine.setPosition(playerSpriteDefinition.key, {
    x: 15,
    y: 98,
  });
};
