import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { JsonValue } from '@prisma/client/runtime/library';
import { getAdminCreators } from '../../services/creator-db-services/get-admin-creators.service';
import { getCreatorsRedis } from '../../services/redis-services/get-creators-redis.service';
import { storeCreatorsRedis } from '../../services/redis-services/store-creators-redis.service';
import { getPublicCreators } from '../../services/creator-db-services/get-public-creators.service';
import { GetCreatorSearchParams } from '../../types/creator';
import { isNumber } from '../../utils/functions/validate-input.function';
import validator from 'validator';
import { sanitiseArray } from '../../utils/functions/sanitise-array.function';

const { escape } = validator;

export const getCreators = async (req: Request, res: Response) => {
  //if no search params are given, try fetching the default creators from redis.
  if (Object.keys(req.query).length == 0) {
    try {
      const redisCreators = await getCreatorsRedis();
      return res.status(200).json(redisCreators);
    } catch (error) {
      //if fetching data from redis fails, try fetching data from main database
      try {
        const { pagination, creators } = await getPublicCreators();
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
  let { page, limit, name, language, category, admin } = req.query;
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

    if (language) {
      searchParams.language = escape(language as string).trim();
    }

    if (category) {
      const categories = (category as string).split(' ');
      searchParams.categories = sanitiseArray(categories);
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
  try {
    if (admin && admin == 'true') {
      const { pagination, creators } = await getAdminCreators(searchParams);
      return res.status(200).json({
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        entries: pagination.entries,
        totalEntries: pagination.totalEntries,
        creators,
      });
    } else {
      const { pagination, creators } = await getPublicCreators(searchParams);
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
