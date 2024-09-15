import { ContentStatus } from '@prisma/client';
import { SocialLinks } from './social-links';

export type GuildCreationData = {
  name: string;
  description: string;
  excerpt: string;
  guildLeader?: string;
  status: ContentStatus;
  languages: string[];
  tags: string[];
  regions: string[];
  userId?: string;
  socials: SocialLinks;
  videoUrl: string;
};

export type GuildSearchParams = {
  page?: number;
  limit?: number;
  name?: string;
  languages?: string[];
  tags?: string[];
  regions?: string[];
  status?: ContentStatus;
};

export type GuildUpdateData = {
  name?: string;
  description?: string;
  excerpt?: string;
  guildLeader?: string;
  status?: ContentStatus;
  languages?: string[];
  tags?: string[];
  regions?: string[];
  userId?: string;
  socials?: SocialLinks;
  videoUrl?: string;
};
