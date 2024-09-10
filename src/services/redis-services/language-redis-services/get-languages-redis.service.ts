import { redisClient } from '../../../lib/redis/client.redis';

const getLanguagesRedis = async () => {
  try {
    const result = await redisClient.hGetAll('languages');
    const publicLangs = JSON.parse(result.public_languages);
    const allLangs = JSON.parse(result.all_languages);

    return { publicLangs, allLangs };
  } catch (error) {
    throw error;
  }
};

export default getLanguagesRedis;
