import { redisClient } from '../../../lib/redis/client.redis';

const getCreatorTagsRedis = async () => {
  try {
    const result = await redisClient.hGetAll('creator_tags');
    const publicTags = JSON.parse(result.public_tags);
    const allTags = JSON.parse(result.all_tags);

    if (publicTags.length == 0) {
      throw new Error('no public tags found');
    }

    if (allTags.length == 0) {
      throw new Error('no all tags found');
    }

    return { publicTags, allTags };
  } catch (error) {
    throw error;
  }
};

export default getCreatorTagsRedis;
