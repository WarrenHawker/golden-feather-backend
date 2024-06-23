import { ContentStatus } from '@prisma/client';

export interface GuildUpdateData {
  name?: string;
  region?: string;
  language?: string;
  bio?: string;
  guild_leader?: string;
  status?: ContentStatus;
  updated_on: Date;
}
