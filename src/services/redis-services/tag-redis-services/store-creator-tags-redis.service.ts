import { IOredisClient } from '../../../lib/redis/client.redis';
import getCreatorTagsDB from '../../db-services/tag-db-services/creator-tag-db-services/get-creator-tags.service';
import deleteKeyRedis from '../delete-key-redis.service';

const storeCreatorTagsRedis = async () => {
  try {
    await deleteKeyRedis('creator_tags');
    const { publicTags, allTags } = await getCreatorTagsDB();

    IOredisClient!.hset(
      'creator_tags',
      'public_tags',
      JSON.stringify(publicTags)
    );
    IOredisClient!.hset('creator_tags', 'all_tags', JSON.stringify(allTags));
  } catch (error) {
    throw error;
  }
};

export default storeCreatorTagsRedis;
