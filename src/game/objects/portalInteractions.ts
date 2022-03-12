import { InteractionLookup, InteractionOperation } from '../types/interactions';

const interactionLookup: InteractionLookup = {
  ['1169']: () => alert('used leftmost portal'),
  ['1289']: () => alert('used middle portal'),
  ['1409']: () => alert('used rightmost portal'),
};

export const performPortalInteraction: InteractionOperation = (id, params) => {
  const interaction = interactionLookup[id];

  if (!interaction) return;

  interaction(params);
};
