//import packages
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import 'dotenv/config';
import IORedis from 'ioredis';

//initialise redis client
export const redisClient = createClient({
  url: process.env.REDIS_URL || '',
  socket: {
    connectTimeout: 50000,
  },
});

//ioredis instance used by bullmq
const url = process.env.REDIS_URL || '';
export const IOredisClient = new IORedis(url, {
  connectTimeout: 50000,
  maxRetriesPerRequest: null,
});

//initialise redis store
export const redisStore = new RedisStore({ client: redisClient });
