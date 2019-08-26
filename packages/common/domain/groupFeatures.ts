import { GroupType } from './Group';

type GroupFeaturesConfig = {
  hasMeetings?: boolean;
  hasPresence?: boolean;
  hasTasks?: boolean;
  hasAttachedGroups?: boolean;
};

export const groupFeatures: Record<GroupType, GroupFeaturesConfig> = {
  [GroupType.Lecture]: {
    hasAttachedGroups: true,
  },
  [GroupType.Lab]: {
    hasMeetings: true,
    hasPresence: true,
  },
  [GroupType.Exercise]: {
    hasMeetings: true,
    hasPresence: true,
  },
};
