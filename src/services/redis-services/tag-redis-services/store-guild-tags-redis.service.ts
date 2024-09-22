import { IOredisClient } from '../../../lib/redis/client.redis';
import getGuildTagsDB from '../../db-services/tag-db-services/guild-tag-db-services/get-guild-tags.service';
import deleteKeyRedis from '../delete-key-redis.service';

const storeGuildTagsRedis = async () => {
  try {
    await deleteKeyRedis('guild_tags');
    const { publicTags, allTags } = await getGuildTagsDB();

    IOredisClient!.hset(
      'guild_tags',
      'public_tags',
      JSON.stringify(publicTags)
    );
    IOredisClient!.hset('guild_tags', 'all_tags', JSON.stringify(allTags));
  } catch (error) {
    throw error;
  }
};

export default storeGuildTagsRedis;
