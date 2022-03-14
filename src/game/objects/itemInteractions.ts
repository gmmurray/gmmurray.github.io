import {
  InteractionLookup,
  InteractionOperation,
  PerformInteraction,
} from '../types/interactions';

const interactionLookup: InteractionLookup = {
  ['1791']: params => item1791(params),
  ['11091']: params => item11091(params),
  ['11290']: params => item11290(params),
  ['12092']: params => item12092(params),
};

export const performItemInteraction: InteractionOperation = (id, params) => {
  const interaction = interactionLookup[id];
  console.log(params);

  if (!interaction) return;

  interaction(params);
};

const item1791: PerformInteraction = params => {
  alert('computer used');
};

const item11091: PerformInteraction = params => {
  alert('unf used');
};
const item11290: PerformInteraction = params => {
  alert('uf used');
};
const item12092: PerformInteraction = params => {
  alert('bio used');
};