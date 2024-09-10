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
import { ErrorReturn } from '../../types/error-return';

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
      const langs = (lang as string).split(' ');
      searchParams.languages = sanitiseArray(langs);
    }

    if (tag) {
      const tags = (tag as string).split(' ');
      searchParams.tags = sanitiseArray(tags);
    }
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
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
        return res.status(error.code).json(error);
      }
      if (sessionUser.role != 'admin' || sessionUser.status != 'active') {
        const error: ErrorReturn = {
          code: 403,
          message: 'Forbidden: Admin access required',
        };
        return res.status(error.code).json(error);
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
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default getCreators;
