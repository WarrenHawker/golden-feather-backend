import { redisClient } from '../../../lib/redis/client.redis';
import getLanguagesDB from '../../db-services/language-db-services/get-languages-db.service';
import deleteKeyRedis from '../delete-key-redis.service';

const storeLanguagesRedis = async () => {
  try {
    await deleteKeyRedis('languages');
    const languages = await getLanguagesDB();
    redisClient.set('languages', JSON.stringify(languages));
  } catch (error) {
    throw error;
  }
};

export default storeLanguagesRedis;
