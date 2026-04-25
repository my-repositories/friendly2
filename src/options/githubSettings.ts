export type GithubSettings = Record<GithubOptions, boolean>;

export enum GithubOptions
{
  FOLLOWERS = "Followers",
  STARS = "Stars"
};

export const defaultGithubSettings: GithubSettings = {
  [GithubOptions.FOLLOWERS]: true,
  [GithubOptions.STARS]: false
};

export const githubSettingsKey = "github";
