import { app } from './app';
import { redisClient } from './lib/redis/client.redis';
import {
  maintainTwitchToken,
  generateTwitchToken,
} from './services/twitch-token.service';
import {
  syncDatabase,
  prefetchCreators,
  prefetchGuilds,
} from './services/sync-database';
import { initializeMongoDatabase } from './lib/mongoose/config.mongoose';

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await initializeMongoDatabase();
    //clear redis database
    redisClient.flushAll();

    //create new twitch API token and store in redis
    const newToken = await generateTwitchToken();
    redisClient.hSet('twitch_token', 'token_id', newToken);

    //get the 10 first public content creators and guilds and store them in redis
    await prefetchCreators();
    await prefetchGuilds();

    //set up bullmq to validate twitch token every hour
    maintainTwitchToken();

    //set up bullmq to resync databases every 6 hours
    syncDatabase();

    console.log(
      `server running on port ${port}, Is redis client connected? ${redisClient.isOpen}`
    );
  } catch (error) {
    console.error(error);
  }
});
