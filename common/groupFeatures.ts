import { GroupType } from '.';

type GroupFeaturesConfig = {
  hasLists?: boolean;
  hasMeetings?: boolean;
  hasPresence?: boolean;
};

export const groupFeatures: Record<GroupType, GroupFeaturesConfig> = {
  [GroupType.Lecture]: {},
  [GroupType.Lab]: {
    hasLists: true,
    hasMeetings: true,
    hasPresence: true,
  },
  [GroupType.Exercise]: {
    hasLists: true,
    hasMeetings: true,
    hasPresence: true,
  },
};
