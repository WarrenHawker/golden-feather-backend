import { app } from './app';
import { redisClient } from './lib/redis/client.redis';
import {
  maintainTwitchToken,
  generateTwitchToken,
} from './services/scheduled-tasks/twitch-token.service';
import { syncDatabase } from './services/scheduled-tasks/sync-database';
import { initializeMongoDatabase } from './lib/mongoose/config.mongoose';
import { storeCreatorsRedis } from './services/redis-services/store-creators-redis.service';
import { storeGuildsRedis } from './services/redis-services/store-guilds-redis.service';
import { dummyCreators } from './utils/dummy-creators';
import { createCreator } from './services/creator-db-services/create-creator.service';
import { storeCreatorTagsRedis } from './services/redis-services/store-creator-tags-redis.service';

const port = process.env.PORT || 5000;

const doCreation = async (creator: any) => {
  if (creator.status == 'public') {
    await createCreator('public', creator);
    await createCreator('admin', creator);
  } else if (creator.status == 'private') {
    await createCreator('admin', creator);
  }
};

const setDummyCreators = async () => {
  try {
    for (const creator of dummyCreators) {
      await doCreation(creator);
    }
  } catch (error) {
    throw error;
  }
};

app.listen(port, async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await initializeMongoDatabase();
    //clear redis database
    redisClient.flushAll();

    //create new twitch API token and store in redis
    await generateTwitchToken();

    //get the tags and 10 first public creators and guilds and store them in redis
    await storeCreatorsRedis();
    await storeGuildsRedis();
    await storeCreatorTagsRedis();

    //scheduled tasks
    maintainTwitchToken();
    syncDatabase();

    //test add dummy content creators
    //setDummyCreators();

    console.log(
      `server running on port ${port}, Is redis client connected? ${redisClient.isOpen}`
    );
  } catch (error) {
    console.error(error);
  }
});
