import { redisClient } from '../../../lib/redis/client.redis';
import getRegionsDB from '../../db-services/region-db-services/get-regions.service';
import deleteKeyRedis from '../delete-key-redis.service';

const storeRegionsRedis = async () => {
  try {
    await deleteKeyRedis('regions');
    const { publicRegions, allRegions } = await getRegionsDB();
    redisClient.hSet(
      'regions',
      'public_regions',
      JSON.stringify(publicRegions)
    );
    redisClient.hSet('regions', 'all_regions', JSON.stringify(allRegions));
  } catch (error) {
    throw error;
  }
};

export default storeRegionsRedis;
