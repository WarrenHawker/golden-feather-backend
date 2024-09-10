import { Request, Response } from 'express';
import { escape } from 'validator';
import getGuildsRedis from '../../services/redis-services/guild-redis-services/get-guilds-redis.service';
import storeGuildsRedis from '../../services/redis-services/guild-redis-services/store-guilds-redis.service';
import { ISession } from '../../types/express-session';
import { GetGuildSearchParams } from '../../types/guild';
import sanitiseArray from '../../utils/functions/sanitise-array.function';
import { isNumber } from '../../utils/functions/validate-input.function';
import getAdminGuildsDB from '../../services/db-services/guild-db-services/get-admin-guilds.service';
import getPublicGuildsDB from '../../services/db-services/guild-db-services/get-public-guilds.service';
import { ErrorReturn } from '../../types/error-return';

const getGuilds = async (req: Request, res: Response) => {
  //if no search params are given, try fetching the default guilds from redis.
  if (Object.keys(req.query).length == 0) {
    try {
      const redisGuilds = await getGuildsRedis();
      return res.status(200).json(redisGuilds);
    } catch (error) {
      //if fetching data from redis fails, try fetching data from main database
      try {
        const { pagination, guilds } = await getPublicGuildsDB();
        await storeGuildsRedis({ pagination, guilds });
        return res.status(200).json({
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          entries: pagination.entries,
          totalEntries: pagination.totalEntries,
          guilds,
        });
      } catch (err) {
        const error: ErrorReturn = {
          code: (err as any).statusCode || (err as any).status || 500,
          message: (err as Error).message,
          stack: (err as Error).stack,
        };
        return res.status(error.code).json(error);
      }
    }
  }

  //if there are any search params, validate and sanitise, then fetch data from main database
  let { page, limit, name, lang, tag, admin, region } = req.query;
  let searchParams: GetGuildSearchParams = {};
  try {
    if (page) {
      if (!isNumber(page as string)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid "page" search param',
        };
        return res.status(error.code).json(error);
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
        return res.status(error.code).json(error);
      } else {
        searchParams.limit = parseInt(limit as string);
      }
    }

    if (name) {
      searchParams.name = escape(name as string).trim();
    }

    if (lang) {
      const languages = (lang as string).split(' ');
      searchParams.languages = sanitiseArray(languages);
    }

    if (tag) {
      const tags = (tag as string).split(' ');
      searchParams.tags = sanitiseArray(tags);
    }

    if (region) {
      const regions = (region as string).split(' ');
      searchParams.regions = sanitiseArray(regions);
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
  //fetch admin guilds, otherwise fetch public guilds
  //fetching admin guilds can only be done if there is a valid active admin session
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

      const { pagination, guilds } = await getAdminGuildsDB(searchParams);
      return res.status(200).json({
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        entries: pagination.entries,
        totalEntries: pagination.totalEntries,
        guilds,
      });
    } else {
      const { pagination, guilds } = await getPublicGuildsDB(searchParams);
      return res.status(200).json({
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        entries: pagination.entries,
        totalEntries: pagination.totalEntries,
        guilds,
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

export default getGuilds;
