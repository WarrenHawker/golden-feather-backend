import { IOredisClient } from '../../../lib/redis/client.redis';
import { Pagination } from '../../../types/pagination';

const getCreatorsRedis = async () => {
  try {
    const result = await IOredisClient!.hgetall('creators');
    const pagination: Pagination = JSON.parse(result.pagination);
    const creators: any = [];

    for (let key in result) {
      if (key !== 'pagination') {
        creators.push(JSON.parse(result[key]));
      }
    }

    if (!pagination) {
      throw new Error('no pagination data found');
    }

    if (creators.length == 0) {
      throw new Error('no content creators found');
    }

    return {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      entries: pagination.entries,
      totalEntries: pagination.totalEntries,
      creators,
    };
  } catch (error) {
    throw error;
  }
};

export default getCreatorsRedis;
