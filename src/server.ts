import { app } from './app';
import initializeMongoDatabase from './lib/mongoose/config.mongoose';
import { redisClient } from './lib/redis/client.redis';
import storeCreatorTagsRedis from './services/redis-services/tag-redis-services/store-creator-tags-redis.service';
import storeCreatorsRedis from './services/redis-services/creator-redis-services/store-creators-redis.service';
import storeGuildTagsRedis from './services/redis-services/tag-redis-services/store-guild-tags-redis.service';
import storeGuildsRedis from './services/redis-services/guild-redis-services/store-guilds-redis.service';
import {
  maintainTwitchToken,
  generateTwitchToken,
} from './services/scheduled-tasks/twitch-token.service';
import storeLanguagesRedis from './services/redis-services/language-redis-services/store-languages-redis.service';
import syncRedis from './services/scheduled-tasks/sync-database';
import {
  setStarterCreators,
  setStarterGuilds,
} from './utils/starter-data/set-data';
import storeRegionsRedis from './services/redis-services/region-redis-services/store-regions-redis.service';

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await initializeMongoDatabase();

    // await setStarterCreators();
    // await setStarterGuilds();

    if (process.env.NODE_ENV === 'production') {
      console.log('hello');
      redisClient.flushAll();

      await generateTwitchToken();

      await storeCreatorsRedis();
      await storeGuildsRedis();
      await storeGuildTagsRedis();
      await storeCreatorTagsRedis();
      await storeLanguagesRedis();
      await storeRegionsRedis();

      // Scheduled tasks (for production)
      maintainTwitchToken();
      syncRedis();
    }
    console.log(
      `server running on port ${port}, Is redis client connected? ${redisClient.isOpen}`
    );
  } catch (error) {
    console.error(error);
  }
});
