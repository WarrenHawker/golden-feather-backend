import { ContentStatus } from '@prisma/client';
import { SocialLinks } from './social-links';

export type CreatorCreationData = {
  name: string;
  description: string;
  videoUrl: string;
  socials: SocialLinks;
  tags: string[];
  language: string;
  status: ContentStatus;
  userId?: string;
};

export type GetCreatorSearchParams = {
  page?: number;
  limit?: number;
  name?: string;
  language?: string;
  tags?: string[];
  status?: ContentStatus;
};

export type CreatorUpdateData = {
  name?: string;
  description?: string;
  videoUrl?: string;
  socials?: SocialLinks;
  tags?: string[];
  language?: string;
  status?: string;
  userId?: string;
};
