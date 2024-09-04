/**
 * @file get-creator-tags-redis.service.ts
 * @description Service function for retrieving creator tags from Redis. This function attempts to fetch both public
 *              and admin tags stored in a Redis hash under the key 'creator_tags'. The tags are expected to be stored
 *              as JSON strings, which are parsed into arrays. If either public tags or admin tags are not found or are empty,
 *              the function throws an error.
 *
 * @module services/redis
 *
 * @function getCreatorTagsRedis - Asynchronous function to retrieve creator tags from Redis. The function parses the
 *                                 stored JSON strings into arrays and checks for their presence.
 *
 * @returns {Promise<{publicTags: string[], adminTags: string[]}>} - A promise that resolves with an object containing
 *                                                                   the public tags and admin tags arrays.
 *
 * @throws {Error} - Throws an error if the tags are not found, are empty, or if there is an issue with the Redis query.
 *
 * @requires ../../lib/redis/client.redis - Redis client for interacting with the Redis database.
 */

import { redisClient } from '../../../lib/redis/client.redis';

export const getCreatorTagsRedis = async () => {
  try {
    const result = await redisClient.hGetAll('creator_tags');
    const publicTags = JSON.parse(result.public_tags);
    const allTags = JSON.parse(result.all_tags);

    if (publicTags.length == 0) {
      throw new Error('no public tags found');
    }

    if (allTags.length == 0) {
      throw new Error('no all tags found');
    }

    return { publicTags, allTags };
  } catch (error) {
    throw error;
  }
};
