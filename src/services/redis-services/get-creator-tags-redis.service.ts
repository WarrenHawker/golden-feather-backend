import { redisClient } from '../../lib/redis/client.redis';

export const getCreatorTagsRedis = async () => {
  try {
    const result = await redisClient.hGetAll('creator_tags');
    const publicTags = JSON.parse(result.public_tags);
    const adminTags = JSON.parse(result.admin_tags);

    if (publicTags.length == 0) {
      throw new Error('no public tags found');
    }

    if (adminTags.length == 0) {
      throw new Error('no admin tags found');
    }

    return { publicTags, adminTags };
  } catch (error) {
    throw error;
  }
};
