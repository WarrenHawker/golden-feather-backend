import { ContentStatus } from '@prisma/client';

export interface CreatorUpdateData {
  name?: string;
  description?: string;
  categories?: string[];
  socials?: {};
  videoUrl?: string;
  status?: ContentStatus;
  updated_on: Date;
}
