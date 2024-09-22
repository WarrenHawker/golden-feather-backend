// @ts-nocheck

// import { Worker } from 'bullmq';
// import { IOredisClient } from '../../../lib/redis/client.redis';
// import storeCreatorTagsRedis from '../../redis-services/tag-redis-services/store-creator-tags-redis.service';
// import storeCreatorsRedis from '../../redis-services/creator-redis-services/store-creators-redis.service';
// import storeGuildTagsRedis from '../../redis-services/tag-redis-services/store-guild-tags-redis.service';
// import storeGuildsRedis from '../../redis-services/guild-redis-services/store-guilds-redis.service';
// import storeLanguagesRedis from '../../redis-services/language-redis-services/store-languages-redis.service';
// import storeRegionsRedis from '../../redis-services/region-redis-services/store-regions-redis.service';

// const redisConnect = {
//   connection: IOredisClient,
// };

// const syncRedisTask = async () => {
//   new Worker(
//     'resyncRedis',
//     async () => {
//       try {
//         await storeCreatorsRedis();
//         await storeGuildsRedis();
//         await storeCreatorTagsRedis();
//         await storeGuildTagsRedis();
//         await storeLanguagesRedis();
//         await storeRegionsRedis();
//       } catch (error) {
//         throw error;
//       }
//     },
//     redisConnect
//   );
// };

// export default syncRedisTask;

import { Queue, Worker } from 'bullmq';
import { IOredisClient } from '../../lib/redis/client.redis';
import storeCreatorTagsRedis from '../redis-services/tag-redis-services/store-creator-tags-redis.service';
import storeCreatorsRedis from '../redis-services/creator-redis-services/store-creators-redis.service';
import storeGuildTagsRedis from '../redis-services/tag-redis-services/store-guild-tags-redis.service';
import storeGuildsRedis from '../redis-services/guild-redis-services/store-guilds-redis.service';
import storeLanguagesRedis from '../redis-services/language-redis-services/store-languages-redis.service';
import storeRegionsRedis from '../redis-services/region-redis-services/store-regions-redis.service';

const redisConnect = {
  connection: IOredisClient,
};

const syncRedis = async () => {
  const hour6 = 6 * 60 * 60 * 1000;
  const syncRedis = new Queue('syncRedis', redisConnect);
  await syncRedis.add(
    'tasks',
    {},
    { repeat: { every: hour6 }, removeOnComplete: true }
  );

  new Worker(
    'syncRedis',
    async (job) => {
      if (job.name == 'tasks') {
        await storeCreatorsRedis();
        await storeGuildsRedis();
        await storeCreatorTagsRedis();
        await storeGuildTagsRedis();
        await storeLanguagesRedis();
        await storeRegionsRedis();
      }
    },
    redisConnect
  );
};

export default syncRedis;
