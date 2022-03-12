import { InteractionLookup, InteractionOperation } from '../types/interactions';

const interactionLookup: InteractionLookup = {
  ['11927']: () => alert('opened door'),
};

export const performDoorInteraction: InteractionOperation = (id, params) => {
  const interaction = interactionLookup[id];

  if (!interaction) return;

  interaction(params);
};
