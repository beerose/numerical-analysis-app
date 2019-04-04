import { GroupType } from '.';

type GroupFeaturesConfig = {
  hasMeetings?: boolean;
  hasPresence?: boolean;
  hasTasks?: boolean;
  hasAttachedGroups?: boolean;
};

export const groupFeatures: Record<GroupType, GroupFeaturesConfig> = {
  [GroupType.Lecture]: {
    hasTasks: true,
    hasAttachedGroups: true,
  },
  [GroupType.Lab]: {
    hasMeetings: true,
    hasPresence: true,
    hasTasks: true,
  },
  [GroupType.Exercise]: {
    hasMeetings: true,
    hasPresence: true,
    hasTasks: true,
  },
};
