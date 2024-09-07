import { redisClient } from '../../../lib/redis/client.redis';
import getGuildTagsDB from '../../guild-db-services/get-guild-tags.service';
import deleteKeyRedis from '../delete-key-redis.service';

const storeGuildTagsRedis = async () => {
  try {
    await deleteKeyRedis('guild_tags');
    const { publicTags, allTags } = await getGuildTagsDB();

    const public_tags = publicTags.map((tag: { name: any }) => tag.name);
    const all_tags = allTags.map((tag: { name: any }) => tag.name);

    redisClient.hSet('guild_tags', 'public_tags', JSON.stringify(public_tags));
    redisClient.hSet('guild_tags', 'all_tags', JSON.stringify(all_tags));
  } catch (error) {
    throw error;
  }
};

export default storeGuildTagsRedis;
