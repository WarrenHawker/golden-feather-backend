import { Queue, Worker } from 'bullmq';
import { IOredisClient } from '../../lib/redis/client.redis';
import storeCreatorsRedis from '../redis-services/creator-redis-services/store-creators-redis.service';
import storeGuildsRedis from '../redis-services/guild-redis-services/store-guilds-redis.service';
import storeLanguagesRedis from '../redis-services/language-redis-services/store-languages-redis.service';
import storeRegionsRedis from '../redis-services/region-redis-services/store-regions-redis.service';
import storeCreatorTagsRedis from '../redis-services/tag-redis-services/store-creator-tags-redis.service';
import storeGuildTagsRedis from '../redis-services/tag-redis-services/store-guild-tags-redis.service';

const redisConnect = {
  connection: IOredisClient,
};

const syncRedisTask = async () => {
  const hour6 = 6 * 60 * 60 * 1000; //every 6 hours
  const syncRedis = new Queue('redisSyncQueue', redisConnect);
  await syncRedis.add(
    'resyncRedis',
    { priority: 4 },
    { repeat: { every: hour6 }, removeOnComplete: true }
  );

  new Worker(
    'resyncRedis',
    async () => {
      await storeCreatorsRedis();
      await storeGuildsRedis();
      await storeCreatorTagsRedis();
      await storeGuildTagsRedis();
      await storeLanguagesRedis();
      await storeRegionsRedis();
    },
    redisConnect
  );
};

export default syncRedisTask;
