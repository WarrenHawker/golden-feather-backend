import { redisClient } from '../../../lib/redis/client.redis';

const getLanguagesRedis = async () => {
  try {
    const result = await redisClient.get('languages');
    if (result) {
      const languages = JSON.parse(result);
      return languages;
    }
  } catch (error) {
    throw error;
  }
};

export default getLanguagesRedis;
