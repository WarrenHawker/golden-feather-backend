import { redisClient } from '../../../lib/redis/client.redis';
import { Pagination } from '../../../types/pagination';
import getPublicGuildsDB from '../../db-services/guild-db-services/get-public-guilds.service';
import deleteKeyRedis from '../delete-key-redis.service';

type Params = {
  pagination?: Pagination;
  guilds?: any[];
};

const storeGuildsRedis = async (options: Params = {}) => {
  try {
    await deleteKeyRedis('guilds');
    if (!options.guilds || !options.pagination) {
      const { pagination, guilds } = await getPublicGuildsDB();
      guilds.forEach((guild: any) => {
        redisClient.hSet('guilds', guild.id, JSON.stringify(guild));
      });
      redisClient.hSet('guilds', 'pagination', JSON.stringify(pagination));
    } else {
      options.guilds.forEach((guild: any) => {
        redisClient.hSet('guilds', guild.id, JSON.stringify(guild));
      });
      redisClient.hSet(
        'guilds',
        'pagination',
        JSON.stringify(options.pagination)
      );
    }
  } catch (error) {
    throw error;
  }
};

export default storeGuildsRedis;
