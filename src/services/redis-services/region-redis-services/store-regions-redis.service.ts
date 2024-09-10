import { redisClient } from '../../../lib/redis/client.redis';
import getRegionsDB from '../../db-services/region-db-services/get-regions-db.service';
import deleteKeyRedis from '../delete-key-redis.service';

const storeRegionsRedis = async () => {
  try {
    await deleteKeyRedis('regions');
    const regions = await getRegionsDB();
    redisClient.set('regions', JSON.stringify(regions));
  } catch (error) {
    throw error;
  }
};

export default storeRegionsRedis;
