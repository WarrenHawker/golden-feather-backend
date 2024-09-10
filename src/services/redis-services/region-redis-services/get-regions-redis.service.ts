import { redisClient } from '../../../lib/redis/client.redis';

const getRegionsRedis = async () => {
  try {
    const result = await redisClient.hGetAll('regions');
    const publicRegions = JSON.parse(result.public_regions);
    const allRegions = JSON.parse(result.all_regions);

    return { publicRegions, allRegions };
  } catch (error) {
    throw error;
  }
};

export default getRegionsRedis;
