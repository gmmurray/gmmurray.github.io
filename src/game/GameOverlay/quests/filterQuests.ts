import { Experience, IdentifiableExperience } from '../../types/cmsContent';

export const filterQuests = (
  quests: IdentifiableExperience[],
  tab: 0 | 1 | 2,
) => {
  let filterCallback: (quest: IdentifiableExperience) => boolean;
  switch (tab) {
    case 0:
      filterCallback = () => true;
      break;
    case 1:
      filterCallback = quest => quest.isActive;
      break;
    case 2:
      filterCallback = quest => !quest.isActive;
      break;
  }

  return quests.filter(filterCallback);
};

export const identifyQuests = (
  quests: Experience[],
): IdentifiableExperience[] =>
  quests.map((quest, index) => ({ ...quest, id: index }));
