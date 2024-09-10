import { ContentStatus } from '@prisma/client';
import { SocialLinks } from './social-links';

export type CreatorCreationData = {
  name: string;
  description: string;
  excerpt: string;
  videoUrl: string;
  socials: SocialLinks;
  tags: string[];
  languages: string[];
  status: ContentStatus;
  userId?: string;
};

export type GetCreatorSearchParams = {
  page?: number;
  limit?: number;
  name?: string;
  languages?: string[];
  tags?: string[];
  status?: ContentStatus;
};

export type CreatorUpdateData = {
  name?: string;
  description?: string;
  excerpt?: string;
  videoUrl?: string;
  socials?: SocialLinks;
  tags?: string[];
  languages?: string[];
  status?: string;
  userId?: string;
};
