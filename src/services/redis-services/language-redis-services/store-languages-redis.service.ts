import { redisClient } from '../../../lib/redis/client.redis';
import getLanguagesDB from '../../db-services/language-db-services/get-languages.service';
import deleteKeyRedis from '../delete-key-redis.service';

const storeLanguagesRedis = async () => {
  try {
    await deleteKeyRedis('languages');
    const { publicLangs, allLangs } = await getLanguagesDB();
    redisClient.hSet(
      'languages',
      'public_languages',
      JSON.stringify(publicLangs)
    );
    redisClient.hSet('languages', 'all_languages', JSON.stringify(allLangs));
  } catch (error) {
    throw error;
  }
};

export default storeLanguagesRedis;
