import { GroupType } from '.';

type GroupFeaturesConfig = {
  hasMeetings?: boolean;
  hasPresence?: boolean;
  hasTasks?: boolean;
  hasTests?: boolean;
};

export const groupFeatures: Record<GroupType, GroupFeaturesConfig> = {
  [GroupType.Lecture]: {
    hasTests: true,
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
    hasTests: true,
  },
};
