/**
 * @file get-creators-redis.service.ts
 * @description Service function for retrieving creator data and pagination information from Redis. This function attempts
 *              to fetch stored creator data under the key 'creators' from Redis. The pagination data is expected to be
 *              stored as a JSON string, which is parsed into an object. The creators are stored separately under individual
 *              keys and are also parsed from JSON strings. If either the pagination data or the creators array is missing
 *              or empty, the function throws an error.
 *
 * @module services/redis
 *
 * @function getCreatorsRedis - Asynchronous function to retrieve a list of creators and their pagination details from Redis.
 *                              The function parses the stored JSON strings and organizes the creators into an array.
 *
 * @returns {Promise<{currentPage: number, totalPages: number, entries: number, totalEntries: number, creators: any[]}>} - A
 *          promise that resolves with an object containing the pagination details and an array of creator objects.
 *
 * @throws {Error} - Throws an error if the pagination data or creators are not found, are empty, or if there is an issue
 *                   with the Redis query.
 *
 * @requires ../../lib/redis/client.redis - Redis client for interacting with the Redis database.
 * @requires ../../types/pagination - Type definition for the pagination structure.
 */

import { redisClient } from '../../../lib/redis/client.redis';
import { Pagination } from '../../../types/pagination';

const getCreatorsRedis = async () => {
  try {
    const result = await redisClient.hGetAll('creators');
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
