export type HabrCareerSettings = Record<HabrCareerOptions, boolean>;

export enum HabrCareerOptions
{
  FRIENDS = "Friends"
};

export const defaultHabrCareerSettings: HabrCareerSettings = {
  [HabrCareerOptions.FRIENDS]: true,
};

export const habr_careerSettingsKey = "habr_career";
