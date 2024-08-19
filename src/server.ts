import { app } from './app';
import { redisClient } from './lib/redis/client.redis';
import mongoose from 'mongoose';
import maintainTwitchToken, {
  generateTwitchToken,
} from './services/twitch-token.service';

const port = process.env.PORT || 5000;

//currently active environment (development or production), used by email templates
export let activeEnvironment: string;

const mongodb = process.env.MONGO_DB || 'mongodb://localhost:8080';

app.listen(port, async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // await redisClient.connect();
    await mongoose.connect(mongodb, {
      dbName: 'golden_feather_logs',
    });

    //clear redis database
    redisClient.flushAll();

    //create new twitch API token and store in redis
    const newToken = await generateTwitchToken();
    redisClient.hSet('twitch_token', 'token_id', newToken);

    //set up bullmq to validate twitch token every hour
    maintainTwitchToken();

    console.log(
      `server running on port ${port}, Is redis client connected? ${redisClient.isOpen}`
    );
    console.log('environment: ', app.get('env'));
    activeEnvironment = app.get('env');
  } catch (error) {
    console.error(error);
  }
});
