import {
  GetAndPerformInteractionParams,
  InteractionType,
  InteractionTypeLookup,
} from '../types/interactions';

import { performCharacterInteraction } from './characterInteractions';
import { performItemInteraction } from './itemInteractions';

const interactionTypeLookup: InteractionTypeLookup = {
  [InteractionType.CHAR]: (id, params) =>
    performCharacterInteraction(id, params),
  [InteractionType.ITEM]: (id, params) => performItemInteraction(id, params),
};

export const getAndPerformInteraction = (
  params: GetAndPerformInteractionParams,
) => {
  const interaction = interactionTypeLookup[params.type];
  if (!interaction) return;

  const id =
    params.charId ??
    createInteractionId(params.level, params.tileX, params.tileY);

  interaction(id, params);
};

const createInteractionId = (
  level: GetAndPerformInteractionParams['level'],
  tileX: GetAndPerformInteractionParams['tileX'],
  tileY: GetAndPerformInteractionParams['tileY'],
) => `${level}${tileX}${tileY}`;
