import {
  GetAndPerformInteractionParams,
  InteractionType,
  InteractionTypeLookup,
} from '../types/interactions';

import { performCharacterInteraction } from './characterInteractions';
import { performDoorInteraction } from './doorInteractions';
import { performPortalInteraction } from './portalInteractions';

const interactionTypeLookup: InteractionTypeLookup = {
  [InteractionType.DOOR]: (id, params) => performDoorInteraction(id, params),
  [InteractionType.PORTAL]: (id, params) =>
    performPortalInteraction(id, params),
  [InteractionType.CHAR]: (id, params) =>
    performCharacterInteraction(id, params),
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
