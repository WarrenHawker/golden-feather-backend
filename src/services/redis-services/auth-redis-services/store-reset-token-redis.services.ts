import { IOredisClient } from '../../../lib/redis/client.redis';

const storeResetTokenRedis = async (
  token: string,
  email: string,
  id: string
) => {
  try {
    const redisKey = `passwordReset:token:${token}`;
    const data = JSON.stringify({ email, id });

    await IOredisClient.set(redisKey, data, 'EX', 3600);
  } catch (error) {
    throw error;
  }
};

export default storeResetTokenRedis;
