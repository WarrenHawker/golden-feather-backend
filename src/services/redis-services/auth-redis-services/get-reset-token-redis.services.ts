import { IOredisClient } from '../../../lib/redis/client.redis';

const getResetTokenRedis = async (token: string) => {
  const redisKey = `passwordReset:token:${token}`;
  try {
    const tokenData = await IOredisClient!.get(redisKey);

    if (tokenData) {
      const parsedData = JSON.parse(tokenData);
      return { email: parsedData.email, id: parsedData.userId };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export default getResetTokenRedis;
