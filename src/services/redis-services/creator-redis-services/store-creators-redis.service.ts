import { IOredisClient } from '../../../lib/redis/client.redis';
import { Pagination } from '../../../types/pagination';
import { getPublicCreatorsDB } from '../../db-services/creator-db-services/get-public-creators.service';
import deleteKeyRedis from '../delete-key-redis.service';

type Params = {
  pagination?: Pagination;
  creators?: any[];
};

const storeCreatorsRedis = async (options: Params = {}) => {
  try {
    await deleteKeyRedis('creators');
    if (!options.creators || !options.pagination) {
      const { pagination, creators } = await getPublicCreatorsDB();
      creators.forEach((creator: any) => {
        IOredisClient!.hset('creators', creator.id, JSON.stringify(creator));
      });
      IOredisClient!.hset('creators', 'pagination', JSON.stringify(pagination));
    } else {
      options.creators.forEach((creator: any) => {
        IOredisClient!.hset('creators', creator.id, JSON.stringify(creator));
      });
      IOredisClient!.hset(
        'creators',
        'pagination',
        JSON.stringify(options.pagination)
      );
    }
  } catch (error) {
    throw error;
  }
};

export default storeCreatorsRedis;
