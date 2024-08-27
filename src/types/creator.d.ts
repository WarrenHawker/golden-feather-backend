import { ContentStatus } from '@prisma/client';

export type SocialLinks = {
  discord?: string;
  youtube?: string;
  twitch?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
};

export type CreatorCreationData = {
  name: string;
  description: string;
  videoUrl: string;
  socials: SocialLinks;
  categories: string[];
  language: string;
  status: ContentStatus;
};

export type GetCreatorSearchParams = {
  page?: number;
  limit?: number;
  name?: string;
  language?: string;
  categories?: string[];
};
