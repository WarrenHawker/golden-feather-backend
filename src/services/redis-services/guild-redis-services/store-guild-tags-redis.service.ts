import { redisClient } from '../../../lib/redis/client.redis';
import { getGuildTagsDB } from '../../guild-db-services/get-guild-tags.service';

export const storeGuildTagsRedis = async () => {
  redisClient.del('guild_tags');
  try {
    const { publicTags, allTags } = await getGuildTagsDB();

    const public_tags = publicTags.map((tag) => tag.name);
    const all_tags = allTags.map((tag) => tag.name);

    redisClient.hSet('guild_tags', 'public_tags', JSON.stringify(public_tags));
    redisClient.hSet('guild_tags', 'all_tags', JSON.stringify(all_tags));
  } catch (error) {
    throw error;
  }
};
