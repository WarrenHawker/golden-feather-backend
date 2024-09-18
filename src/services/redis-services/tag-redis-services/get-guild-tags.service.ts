import { IOredisClient } from '../../../lib/redis/client.redis';

const getGuildTagsRedis = async () => {
  try {
    const result = await IOredisClient.hgetall('guild_tags');
    const publicTags = JSON.parse(result.public_tags);
    const allTags = JSON.parse(result.all_tags);

    return { publicTags, allTags };
  } catch (error) {
    throw error;
  }
};

export default getGuildTagsRedis;
