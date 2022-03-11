import { InteractionLookup, InteractionOperation } from '../types/interactions';

const interactionLookup: InteractionLookup = {
  // ex
  100: () => console.log('something'),
};

export const performChestInteraction: InteractionOperation = (id: string) => {
  const interaction = interactionLookup[id];

  if (!interaction) return;

  interaction();
};
