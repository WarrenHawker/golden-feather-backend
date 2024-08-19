import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import 'dotenv/config';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL || '';

// Initialise redis client (node-redis)
export const redisClient = createClient({
  url: redisUrl,
  socket: {
    connectTimeout: 50000,
  },
});

// Handle redis client connection events
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

// Connect the redis client
redisClient.connect().catch(console.error);

// Initialise ioredis instance (for BullMQ)
export const IOredisClient = new IORedis(redisUrl, {
  connectTimeout: 50000,
  maxRetriesPerRequest: null, // Prevents max retries from being set to 20 by default
});

// Handle ioredis client connection events
IOredisClient.on('error', (err) => console.error('IORedis Client Error', err));
IOredisClient.on('connect', () => console.log('IORedis Client Connected'));

// Initialise redis store (used by sessions, etc.)
export const redisStore = new RedisStore({ client: redisClient });
