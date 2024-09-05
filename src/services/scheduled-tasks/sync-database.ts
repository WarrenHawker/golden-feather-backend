/**
 * @file sync-database.service.ts
 * @description Service function for scheduling and executing periodic synchronization of database data with Redis using BullMQ.
 *              This service sets up a BullMQ queue named 'syncDatabase' to run synchronization tasks every 6 hours. The tasks
 *              include storing creators, guilds, and creator tags in Redis by invoking respective service functions. The worker
 *              listens for jobs in the 'syncDatabase' queue and executes the synchronization tasks when triggered.
 *
 * @module services/sync
 *
 * @function syncDatabase - Asynchronous function to schedule and execute periodic database synchronization with Redis using BullMQ.
 *                          The synchronization tasks are scheduled to run every 6 hours.
 *
 * @returns {Promise<void>} - A promise that resolves when the synchronization tasks have been scheduled.
 *
 * @requires bullmq - BullMQ is a Redis-based queue system for handling jobs, used here to schedule and execute periodic tasks.
 * @requires ../../lib/redis/client.redis - Redis client configuration for connecting BullMQ to the Redis database.
 * @requires ../redis-services/store-guilds-redis.service - Service to store guild data in Redis.
 * @requires ../redis-services/store-creators-redis.service - Service to store creator data in Redis.
 * @requires ../redis-services/store-creator-tags-redis.service - Service to store creator tags in Redis.
 */

import { Queue, Worker } from 'bullmq';
import { IOredisClient } from '../../lib/redis/client.redis';
import storeCreatorTagsRedis from '../redis-services/creator-redis-services/store-creator-tags-redis.service';
import storeCreatorsRedis from '../redis-services/creator-redis-services/store-creators-redis.service';
import storeGuildTagsRedis from '../redis-services/guild-redis-services/store-guild-tags-redis.service';
import storeGuildsRedis from '../redis-services/guild-redis-services/store-guilds-redis.service';

const redisConnect = {
  connection: IOredisClient,
};

const syncDatabase = async () => {
  const hour6 = 6 * 60 * 60 * 1000;
  const syncDatabase = new Queue('syncDatabase', redisConnect);
  await syncDatabase.add(
    'tasks',
    {},
    { repeat: { every: hour6 }, removeOnComplete: true }
  );

  new Worker(
    'syncDatabase',
    async (job) => {
      if (job.name == 'tasks') {
        await storeCreatorsRedis();
        await storeGuildsRedis();
        await storeCreatorTagsRedis();
        await storeGuildTagsRedis();
      }
    },
    redisConnect
  );
};

export default syncDatabase;
