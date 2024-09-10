import { redisClient } from '../../../lib/redis/client.redis';

const getCreatorTagsRedis = async () => {
  try {
    const result = await redisClient.hGetAll('creator_tags');
    const publicTags = JSON.parse(result.public_tags);
    const allTags = JSON.parse(result.all_tags);

    return { publicTags, allTags };
  } catch (error) {
    throw error;
  }
};

export default getCreatorTagsRedis;
