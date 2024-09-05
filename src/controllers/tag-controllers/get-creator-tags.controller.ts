/**
 * @file get-creator-tags.controller.ts
 * @description Controller for retrieving creator tags, with an option to fetch either public or admin tags
 *              based on the "admin" query parameter. This controller first attempts to retrieve the tags
 *              from Redis for faster access. If the Redis retrieval fails, it falls back to querying the
 *              main database. The controller distinguishes between public and admin tags based on the
 *              presence and value of the "admin" query parameter.
 *
 * @module controllers/creator
 *
 * @function getCreatorTags - Express middleware function to handle GET requests for retrieving creator tags,
 *                            with support for both public and admin tags based on the query parameters.
 *
 * @param {Request} req - The Express request object, which may contain the "admin" query parameter to specify
 *                        whether admin tags or public tags should be returned.
 * @param {Response} res - The Express response object used to send the JSON response with the tags data.
 *
 * @returns {Promise<Response>} - A promise that resolves with an HTTP response containing either the requested
 *                                tags data or an error message.
 *
 * @throws {Error} - Throws a 500 error if there is an issue retrieving the tags from either Redis or the database.
 *
 * @requires ../../types/error-return - Type definition for the structure of error responses.
 * @requires ../../services/redis-services/get-creator-tags-redis.service - Service to fetch creator tags from Redis.
 * @requires ../../services/creator-db-services/get-creator-tags.service - Service to fetch creator tags from the database.
 */

import { Request, Response } from 'express';
import ErrorReturn from '../../types/error-return';
import getCreatorTagsDB from '../../services/creator-db-services/get-creator-tags.service';
import getCreatorTagsRedis from '../../services/redis-services/creator-redis-services/get-creator-tags-redis.service';
import { ISession } from '../../types/express-session';
import createLog from '../../services/logger.service';

const getCreatorTags = async (req: Request, res: Response) => {
  const { admin } = req.query;
  //try fetching tags from redis. If that fails, get tags from main database
  try {
    const { publicTags, allTags } = await getCreatorTagsRedis();

    if (
      admin &&
      admin == 'true' &&
      ((req.session as ISession).user.role != 'admin' ||
        (req.session as ISession).user.status != 'active')
    ) {
      return res.status(200).json(allTags);
    } else {
      return res.status(200).json(publicTags);
    }
  } catch (error) {
    //fetch tags from main database
    try {
      const { publicTags, allTags } = await getCreatorTagsDB();
      const public_tags = publicTags.map((tag: { name: any }) => tag.name);
      const all_tags = allTags.map((tag: { name: any }) => tag.name);

      /*
        all tags will only be sent if the admin query is true and there 
        is a valid active admin session.  
      */
      if (
        admin &&
        admin == 'true' &&
        ((req.session as ISession).user.role != 'admin' ||
          (req.session as ISession).user.status != 'active')
      ) {
        return res.status(200).json(all_tags);
      } else {
        return res.status(200).json(public_tags);
      }
    } catch (err) {
      const error: ErrorReturn = {
        code: 500,
        message: (err as Error).message,
      };
      createLog('critical', req, res, error);
      return res.status(500).json(error);
    }
  }
};

export default getCreatorTags;
