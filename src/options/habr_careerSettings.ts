export type habrCareerSettings = Record<habrCareerOptions, boolean>;

export enum habrCareerOptions
{
  FRIENDS = "Friends"
};

export const defaulthabrCareerSettings: habrCareerSettings = {
  [habrCareerOptions.FRIENDS]: true,
};

export const habr_careerSettingsKey = "habr_career";
