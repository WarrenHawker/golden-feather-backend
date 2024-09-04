import { app } from './app';
import { redisClient } from './lib/redis/client.redis';
import {
  maintainTwitchToken,
  generateTwitchToken,
} from './services/scheduled-tasks/twitch-token.service';
import { syncDatabase } from './services/scheduled-tasks/sync-database';
import { initializeMongoDatabase } from './lib/mongoose/config.mongoose';
import { createCreatorDB } from './services/creator-db-services/create-creator.service';
import { createGuildDB } from './services/guild-db-services/create-guild.service';
import { storeCreatorTagsRedis } from './services/redis-services/creator-redis-services/store-creator-tags-redis.service';
import { storeCreatorsRedis } from './services/redis-services/creator-redis-services/store-creators-redis.service';
import { storeGuildTagsRedis } from './services/redis-services/guild-redis-services/store-guild-tags-redis.service';
import { storeGuildsRedis } from './services/redis-services/guild-redis-services/store-guilds-redis.service';
import { creators } from './utils/dummy-creators-2';
import { guilds } from './utils/dummy-guilds';
import { users } from './utils/dummy-users';
import { createUserDB } from './services/user-db-services/create-user.service';
import bcrypt from 'bcrypt';

const port = process.env.PORT || 5000;

const setDummyUsers = async () => {
  try {
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const userWithHashedPassword = {
        ...user,
        password: hashedPassword,
      };
      await createUserDB(userWithHashedPassword);
    }
  } catch (error) {
    throw error;
  }
};

const setDummyCreators = async () => {
  try {
    for (const creator of creators) {
      await createCreatorDB(creator);
    }
  } catch (error) {
    throw error;
  }
};

const setDummyGuilds = async () => {
  try {
    for (const guild of guilds) {
      await createGuildDB(guild);
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

    //add dummy creators and guilds
    //await setDummyCreators();
    //await setDummyGuilds();
    //await setDummyUsers();

    //create new twitch API token and store in redis
    await generateTwitchToken();

    //get the tags and 10 first public creators and guilds and store them in redis
    await storeCreatorsRedis();
    await storeGuildsRedis();
    await storeGuildTagsRedis();
    await storeCreatorTagsRedis();

    //scheduled tasks
    maintainTwitchToken();
    syncDatabase();

    console.log('dev or prod: ', process.env.NODE_ENV);
    console.log(
      `server running on port ${port}, Is redis client connected? ${redisClient.isOpen}`
    );
  } catch (error) {
    console.error(error);
  }
});
