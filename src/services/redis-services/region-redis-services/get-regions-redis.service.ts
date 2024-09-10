import { redisClient } from '../../../lib/redis/client.redis';

const getRegionsRedis = async () => {
  try {
    const result = await redisClient.get('regions');
    if (result) {
      const regions = JSON.parse(result);
      return regions;
    }
  } catch (error) {
    throw error;
  }
};

export default getRegionsRedis;
