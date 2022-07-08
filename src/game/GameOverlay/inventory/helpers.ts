import {
  FeaturedProject,
  InventoryProject,
  OtherProject,
} from '../../types/cmsContent';

import { shuffleArray } from '../../helpers/solutions';

export const combineProjectArrays = (
  featuredProjects: FeaturedProject[],
  otherProjects: OtherProject[],
): InventoryProject[] => {
  if (featuredProjects.length === 0 && otherProjects.length === 0) {
    return [];
  }

  let result: InventoryProject[] = [];

  featuredProjects.forEach(
    ({ title, titleUrl, techTags, content, iconName, iconColor }) => {
      result.push({
        title,
        url: titleUrl,
        techTags: [...techTags.items],
        content,
        type: 'featured',
        iconName,
        iconColor,
      });
    },
  );

  otherProjects.forEach(
    ({ title, repositoryUrl, techTags, content, iconName, iconColor }) => {
      result.push({
        title,
        url: repositoryUrl,
        techTags: [...techTags.items],
        content,
        type: 'other',
        iconName,
        iconColor,
      });
    },
  );

  return shuffleArray(result);
};
