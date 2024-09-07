/**
 * @file store-creators-redis.service.ts
 * @description Service function for storing a list of creators and their pagination details in Redis. This function first
 *              deletes any existing data under the key 'creators' in Redis. If the creators or pagination data are not
 *              provided in the options, the function retrieves the data from the database using the `getPublicCreatorsDB`
 *              service. The creators and pagination details are then stored in Redis as JSON strings. The creators are stored
 *              individually by their IDs, and the pagination information is stored under the 'pagination' field.
 *
 * @module services/redis
 *
 * @function storeCreatorsRedis - Asynchronous function to store creator data and pagination details in Redis. If the data
 *                                is not provided in the options, it fetches the data from the database.
 *
 * @param {Params} [options] - An optional object containing pagination data and an array of creators to be stored. If not provided,
 *                             the data is fetched from the database.
 *
 * @returns {Promise<void>} - A promise that resolves when the creators and pagination data have been successfully stored in Redis.
 *
 * @throws {Error} - Throws an error if there is an issue with the database query or storing data in Redis.
 *
 * @requires ../../lib/redis/client.redis - Redis client for interacting with the Redis database.
 * @requires ../../types/pagination - Type definition for the pagination structure.
 * @requires ../creator-db-services/get-public-creators.service - Service to retrieve public creators from the database.
 */

import { redisClient } from '../../../lib/redis/client.redis';
import Pagination from '../../../types/pagination';
import { getPublicCreatorsDB } from '../../creator-db-services/get-public-creators.service';
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

export default storeCreatorsRedis;
