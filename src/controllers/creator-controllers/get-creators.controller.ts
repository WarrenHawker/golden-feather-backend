/**
 * @file get-creators.controller.ts
 * @description Controller for handling the retrieval of creators based on various search parameters.
 *              If no search parameters are provided, the default is the first 10 "public" creators
 *              (sorted by the "created_on" field) along with pagination data.
 *              This controller attempts to fetch data from Redis for default creators if no search
 *              parameters are provided. If Redis retrieval fails or search parameters are present,
 *              it validates and sanitizes the inputs before querying the main database. If the admin
 *              parameter is absent it will only fetch creators that have a "public" status.
 *
 * @module controllers/creator
 *
 * @function getCreators - Express middleware function to handle GET requests for retrieving creators
 *                         based on optional query parameters such as page, limit, name, language, tag,
 *                         and admin.
 *
 * @param {Request} req - The Express request object, which may contain search parameters as query strings.
 * @param {Response} res - The Express response object used to send the JSON response.
 *
 * @returns {Promise<Response>} - A promise that resolves with an HTTP response containing either the
 *                                requested creator data or an error message.
 *
 * @throws {Error} - Throws a 400 error for invalid input parameters, a 500 error if there is an issue
 *                   with either Redis or database retrieval.
 *
 * @requires ../../types/error-return - Type definition for the structure of error responses.
 * @requires ../../services/creator-db-services/get-admin-creators.service - Service to fetch admin creator data.
 * @requires ../../services/creator-db-services/get-public-creators.service - Service to fetch public creator data.
 * @requires ../../services/redis-services/get-creators-redis.service - Service to fetch creator data from Redis.
 * @requires ../../services/redis-services/store-creators-redis.service - Service to store creator data in Redis.
 * @requires ../../types/creator - Type definition for search parameters used in creator queries.
 * @requires ../../utils/functions/validate-input.function - Utility function to validate numerical input.
 * @requires ../../utils/functions/sanitise-array.function - Utility function to sanitize arrays.
 * @requires validator - Library used to sanitize input strings.
 */

import { Request, Response } from 'express';
import { escape } from 'validator';
import { isNumber } from '../../utils/functions/validate-input.function';
import getCreatorsRedis from '../../services/redis-services/creator-redis-services/get-creators-redis.service';
import storeCreatorsRedis from '../../services/redis-services/creator-redis-services/store-creators-redis.service';
import { GetCreatorSearchParams } from '../../types/creator';
import { ISession } from '../../types/express-session';
import sanitiseArray from '../../utils/functions/sanitise-array.function';
import { getAdminCreatorsDB } from '../../services/db-services/creator-db-services/get-admin-creators.service';
import { getPublicCreatorsDB } from '../../services/db-services/creator-db-services/get-public-creators.service';

const getCreators = async (req: Request, res: Response) => {
  //if no search params are given, try fetching the default creators from redis.
  if (Object.keys(req.query).length == 0) {
    try {
      const redisCreators = await getCreatorsRedis();
      return res.status(200).json(redisCreators);
    } catch (error) {
      //if fetching data from redis fails, try fetching data from main database
      try {
        const { pagination, creators } = await getPublicCreatorsDB();
        await storeCreatorsRedis({ pagination, creators });
        return res.status(200).json({
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          entries: pagination.entries,
          totalEntries: pagination.totalEntries,
          creators,
        });
      } catch (err) {
        const error: ErrorReturn = {
          code: 500,
          message: (err as Error).message,
        };
        return res.status(500).json(error);
      }
    }
  }

  //if there are any search params, validate and sanitise, then fetch data from main database
  let { page, limit, name, lang, tag, admin } = req.query;
  let searchParams: GetCreatorSearchParams = {};
  try {
    if (page) {
      if (!isNumber(page as string)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid "page" search param',
        };
        return res.status(400).json(error);
      } else {
        searchParams.page = parseInt(page as string);
      }
    }

    if (limit) {
      if (!isNumber(limit as string)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid "limit" search param',
        };
        return res.status(400).json(error);
      } else {
        searchParams.limit = parseInt(limit as string);
      }
    }

    if (name) {
      searchParams.name = escape(name as string).trim();
    }

    if (lang) {
      searchParams.language = escape(lang as string).trim();
    }

    if (tag) {
      const tags = (tag as string).split(' ');
      searchParams.tags = sanitiseArray(tags);
    }
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    return res.status(500).json(error);
  }

  //fetch data from main database. If admin search param is true,
  //fetch admin creators, otherwise fetch public creators
  //fetching admin creators can only be done if there is a valid active admin session
  try {
    if (admin && admin == 'true') {
      const sessionUser = (req.session as ISession).user;
      if (!sessionUser) {
        const error: ErrorReturn = {
          code: 401,
          message: 'Unorthorised: Must be signed in',
        };
        return res.status(401).json(error);
      }
      if (sessionUser.role != 'admin' || sessionUser.status != 'active') {
        const error: ErrorReturn = {
          code: 403,
          message: 'Forbidden: Admin access required',
        };
        return res.status(403).json(error);
      }

      const { pagination, creators } = await getAdminCreatorsDB(searchParams);
      return res.status(200).json({
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        entries: pagination.entries,
        totalEntries: pagination.totalEntries,
        creators,
      });
    } else {
      const { pagination, creators } = await getPublicCreatorsDB(searchParams);
      return res.status(200).json({
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        entries: pagination.entries,
        totalEntries: pagination.totalEntries,
        creators,
      });
    }
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    return res.status(500).json(error);
  }
};

export default getCreators;
