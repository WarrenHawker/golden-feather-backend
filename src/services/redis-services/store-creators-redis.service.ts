import { redisClient } from '../../lib/redis/client.redis';
import { Pagination } from '../../types/pagination';
import { getPublicCreators } from '../creator-db-services/get-public-creators.service';

type Params = {
  pagination?: Pagination;
  creators?: any[];
};

export const storeCreatorsRedis = async (options: Params = {}) => {
  redisClient.del('creators');

  try {
    if (!options.creators || !options.pagination) {
      const { pagination, creators } = await getPublicCreators();
      creators.forEach((creator: any) => {
        redisClient.hSet('creators', creator.id, JSON.stringify(creator));
      });
      redisClient.hSet('creators', 'pagination', JSON.stringify(pagination));
    } else {
      options.creators.forEach((creator: any) => {
        redisClient.hSet('creators', creator.id, JSON.stringify(creator));
      });
      redisClient.hSet(
        'creators',
        'pagination',
        JSON.stringify(options.pagination)
      );
    }
  } catch (error) {
    throw error;
  }
};
