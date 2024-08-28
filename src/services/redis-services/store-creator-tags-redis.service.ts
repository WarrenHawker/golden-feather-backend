import { prismaClient } from '../../lib/prisma/client.prisma';
import { redisClient } from '../../lib/redis/client.redis';
import { getCreatorTagsDB } from '../creator-db-services/get-creator-tags.service';

export const storeCreatorTagsRedis = async () => {
  redisClient.del('creator_tags');
  try {
    const { publicTags, adminTags } = await getCreatorTagsDB();

    const public_tags = publicTags.map((tag) => tag.name);
    const admin_tags = adminTags.map((tag) => tag.name);

    redisClient.hSet(
      'creator_tags',
      'public_tags',
      JSON.stringify(public_tags)
    );
    redisClient.hSet('creator_tags', 'admin_tags', JSON.stringify(admin_tags));
  } catch (error) {
    throw error;
  }
};
