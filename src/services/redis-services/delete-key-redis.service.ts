import { redisClient } from '../../lib/redis/client.redis';

const deleteKeyRedis = async (key: string) => {
  try {
    const result = await redisClient.del(key);

    if (result === 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(`Error deleting key '${key}' from Redis:`, error);
    throw error; // Re-throw error to handle it where the function is called
  }
};

export default deleteKeyRedis;
