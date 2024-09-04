import { ContentStatus } from '@prisma/client';
import { SocialLinks } from './social-links';

export type GuildCreationData = {
  name: string;
  description: string;
  guild_leader?: string;
  status: ContentStatus;
  language: string;
  tags: string[];
  region: string;
  userId?: string;
  socials: SocialLinks;
};

export type GetGuildSearchParams = {
  page?: number;
  limit?: number;
  name?: string;
  language?: string;
  tags?: string[];
  status?: ContentStatus;
  region?: string;
};
