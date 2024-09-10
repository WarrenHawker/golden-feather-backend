import { redisClient } from '../../../lib/redis/client.redis';
import getCreatorTagsDB from '../../db-services/tag-db-services/creator-tag-db-services/get-creator-tags.service';
import deleteKeyRedis from '../delete-key-redis.service';

const storeCreatorTagsRedis = async () => {
  try {
    await deleteKeyRedis('creator_tags');
    const { publicTags, allTags } = await getCreatorTagsDB();

    const public_tags = publicTags.map((tag: { name: any }) => tag.name);
    const all_tags = allTags.map((tag: { name: any }) => tag.name);

    redisClient.hSet(
      'creator_tags',
      'public_tags',
      JSON.stringify(public_tags)
    );
    redisClient.hSet('creator_tags', 'all_tags', JSON.stringify(all_tags));
  } catch (error) {
    throw error;
  }
};

export default storeCreatorTagsRedis;
