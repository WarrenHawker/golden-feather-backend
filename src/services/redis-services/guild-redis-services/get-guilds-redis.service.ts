import { redisClient } from '../../../lib/redis/client.redis';

const getGuildsRedis = async () => {
  try {
    const result = await redisClient.hGetAll('guilds');
    const pagination: Pagination = JSON.parse(result.pagination);
    const guilds: any = [];

    for (let key in result) {
      if (key !== 'pagination') {
        guilds.push(JSON.parse(result[key]));
      }
    }

    if (!pagination) {
      throw new Error('no pagination data found');
    }

    if (guilds.length == 0) {
      throw new Error('no guilds found');
    }

    return {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      entries: pagination.entries,
      totalEntries: pagination.totalEntries,
      guilds,
    };
  } catch (error) {
    throw error;
  }
};

export default getGuildsRedis;
