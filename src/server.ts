import { app } from './app';
import initializeMongoDatabase from './lib/mongoose/config.mongoose';
import { IOredisClient } from './lib/redis/client.redis';
import storeCreatorTagsRedis from './services/redis-services/tag-redis-services/store-creator-tags-redis.service';
import storeCreatorsRedis from './services/redis-services/creator-redis-services/store-creators-redis.service';
import storeGuildTagsRedis from './services/redis-services/tag-redis-services/store-guild-tags-redis.service';
import storeGuildsRedis from './services/redis-services/guild-redis-services/store-guilds-redis.service';
import { generateTwitchToken } from './services/scheduled-tasks/tasks/twitch-token-task.service';
import storeLanguagesRedis from './services/redis-services/language-redis-services/store-languages-redis.service';
import {
  setStarterCreators,
  setStarterGuilds,
} from './utils/starter-data/set-data';
import storeRegionsRedis from './services/redis-services/region-redis-services/store-regions-redis.service';
import startScheduledTasks from './services/scheduled-tasks/scheduled-tasks.service';

const port = process.env.PORT || 5000;

export const startServer = async (port: number) => {
  try {
    // Initialize MongoDB and Redis before starting the server
    await initializeMongoDatabase();
    await IOredisClient.connect();

    // await setStarterCreators();
    // await setStarterGuilds();

    // Run these operations only in production
    if (process.env.NODE_ENV === 'production') {
      await IOredisClient.flushall();

      await generateTwitchToken();
      await storeCreatorsRedis();
      await storeGuildsRedis();
      await storeGuildTagsRedis();
      await storeCreatorTagsRedis();
      await storeLanguagesRedis();
      await storeRegionsRedis();

      startScheduledTasks();
    }

    return server; // Return the server instance for further use (e.g., in tests)
  } catch (error) {
    console.error('Error starting server:', error);
    throw error; // Re-throw error for proper error handling
  }
};

// Use this function to start the server
export const server: any = startServer(port as number);
