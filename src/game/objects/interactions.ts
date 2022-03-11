import {
  GetAndPerformInteractionParams,
  InteractionTypeLookup,
} from '../types/interactions';

import { performChestInteraction } from './chestInteractions';

const interactionTypeLookup: InteractionTypeLookup = {
  chest: id => performChestInteraction(id),
};

export const getAndPerformInteraction = (
  params: GetAndPerformInteractionParams,
) => {
  const interaction = interactionTypeLookup[params.type];
  if (!interaction) return;

  interaction(createInteractionId(params.level, params.tileX, params.tileY));
};

const createInteractionId = (
  level: GetAndPerformInteractionParams['level'],
  tileX: GetAndPerformInteractionParams['tileX'],
  tileY: GetAndPerformInteractionParams['tileY'],
) => `${level}${tileX}${tileY}`;
