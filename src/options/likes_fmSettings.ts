export type LikesFmSettings = Record<LikesFmOptions, boolean>;

export enum LikesFmOptions
{
  REPOSTS = "Reposts",
  LIKES = "Likes",
  SUBSCRIBERS = "Subscribers",
  MEMBERS = "Members",
  COMMENTS = "Comments",
  VOTINGS = "Votings",
};

export const defaultLikesFmSettings: LikesFmSettings = {
  [LikesFmOptions.REPOSTS]: false,
  [LikesFmOptions.LIKES]: true,
  [LikesFmOptions.SUBSCRIBERS]: true,
  [LikesFmOptions.MEMBERS]: true,
  [LikesFmOptions.COMMENTS]: false,
  [LikesFmOptions.VOTINGS]: true,
};

export const likes_fmSettingsKey = "likes_fm";
