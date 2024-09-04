import { redisClient } from '../../../lib/redis/client.redis';
import { Pagination } from '../../../types/pagination';
import { getPublicGuildsDB } from '../../guild-db-services/get-public-guilds.service';

type Params = {
  pagination?: Pagination;
  guilds?: any[];
};

export const storeGuildsRedis = async (options: Params = {}) => {
  redisClient.del('guilds');

  try {
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
