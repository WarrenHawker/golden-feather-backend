import { Queue, Worker } from 'bullmq';
import { IOredisClient } from '../../lib/redis/client.redis';
import { storeGuildsRedis } from '../redis-services/store-guilds-redis.service';
import { storeCreatorsRedis } from '../redis-services/store-creators-redis.service';

const redisConnect = {
  connection: IOredisClient,
};

export const syncDatabase = async () => {
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
      }
    },
    redisConnect
  );
};
