import RedisStore from 'connect-redis';
import 'dotenv/config';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL || '';

export const IOredisClient = new IORedis(redisUrl, {
  connectTimeout: 50000,
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

IOredisClient.on('error', (err) => console.error('IORedis Client Error', err));
IOredisClient.on('connect', () => console.log('IORedis Client Connected'));
IOredisClient.on('close', () => console.log('IORedis connection closed'));

export const redisStore = new RedisStore({
  client: IOredisClient,
});

// Function to close Redis connections
export const closeRedisConnection = async () => {
  try {
    await IOredisClient.quit();
  } catch (err) {
    console.error('Error closing Redis connections:', err);
  }
};
