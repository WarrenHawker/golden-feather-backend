/**
 * @file store-creator-tags-redis.service.ts
 * @description Service function for fetching creator tags from the database and storing them in Redis. This function first deletes
 *              any existing creator tags stored under the key 'creator_tags' in Redis. It then retrieves the public and all tags
 *              from the database and stores them in Redis as JSON strings. The tags are stored separately under 'public_tags' and
 *              'all_tags' fields within the 'creator_tags' Redis hash.
 *
 * @module services/redis
 *
 * @function storeCreatorTagsRedis - Asynchronous function to retrieve creator tags from the database and store them in Redis for faster access.
 *
 * @returns {Promise<void>} - A promise that resolves when the tags have been successfully stored in Redis.
 *
 * @throws {Error} - Throws an error if there is an issue with the database query or storing data in Redis.
 *
 * @requires ../../lib/redis/client.redis - Redis client for interacting with the Redis database.
 * @requires ../creator-db-services/get-creator-tags.service - Service to retrieve creator tags from the database.
 */

import { redisClient } from '../../../lib/redis/client.redis';
import getCreatorTagsDB from '../../creator-db-services/get-creator-tags.service';
import deleteKeyRedis from '../delete-key-redis.service';

const storeCreatorTagsRedis = async () => {
  try {
    await deleteKeyRedis('creator_tags');
    const { publicTags, allTags } = await getCreatorTagsDB();

    const public_tags = publicTags.map((tag: { name: any }) => tag.name);
    const all_tags = allTags.map((tag: { name: any }) => tag.name);

    redisClient.hSet(
      'creator_tags',
      'public_tags',
      JSON.stringify(public_tags)
    );
    redisClient.hSet('creator_tags', 'all_tags', JSON.stringify(all_tags));
  } catch (error) {
    throw error;
  }
};

export default storeCreatorTagsRedis;
