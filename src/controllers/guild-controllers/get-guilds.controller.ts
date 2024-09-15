import { NextFunction, Request, Response } from 'express';
import getGuildsRedis from '../../services/redis-services/guild-redis-services/get-guilds-redis.service';
import storeGuildsRedis from '../../services/redis-services/guild-redis-services/store-guilds-redis.service';
import { ISession } from '../../types/express-session';
import getAdminGuildsDB from '../../services/db-services/guild-db-services/get-admin-guilds.service';
import getPublicGuildsDB from '../../services/db-services/guild-db-services/get-public-guilds.service';
import responseHandler from '../../middleware/response-handler.middleware';
import { CustomError } from '../../types/custom-error';
import queryToArray from '../../utils/functions/query-to-array.function';
import { ContentStatus } from '@prisma/client';
import { GuildSearchParams } from '../../types/guild';

const getGuilds = async (req: Request, res: Response, next: NextFunction) => {
  //if no search params are given, try fetching the default guilds from redis.
  if (Object.keys(req.query).length == 0) {
    try {
      const redisGuilds = await getGuildsRedis();
      return responseHandler(req, res, 200, redisGuilds);
    } catch (error) {
      //if fetching data from redis fails, try fetching data from main database
      try {
        const { pagination, guilds } = await getPublicGuildsDB();
        await storeGuildsRedis({ pagination, guilds });
        const data = {
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          entries: pagination.entries,
          totalEntries: pagination.totalEntries,
          guilds,
        };
        return responseHandler(req, res, 200, data);
      } catch (error) {
        const statusCode = (error as any).statusCode || 500;
        const detailedMessage =
          (error as any).message || 'Unknown error occurred';
        return next(
          new CustomError(
            'An unexpected error occurred. Please try again later.',
            statusCode,
            detailedMessage
          )
        );
      }
    }
  }

  //if there are any search params, validate and sanitise, then fetch data from main database
  const { admin, page, limit, name, lang, tag, status, region } = req.query;

  const queryData: GuildSearchParams = {
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
    name: name ? (name as string) : undefined,
    languages: queryToArray(lang),
    tags: queryToArray(tag),
    status: status ? (status as ContentStatus) : undefined,
    regions: queryToArray(region),
  };

  //fetch data from main database. If admin search param is true,
  //fetch admin guilds, otherwise fetch public guilds
  //fetching admin guilds can only be done if there is a valid active admin session
  try {
    if (admin && admin == 'true') {
      const sessionUser = (req.session as ISession).user;
      if (!sessionUser) {
        return next(
          new CustomError(
            'Unauthorized access.',
            401,
            `User Session not found.`
          )
        );
      }
      if (sessionUser.role != 'admin' || sessionUser.status != 'active') {
        return next(
          new CustomError(
            'You do not have permission to access this resource.',
            403,
            `User with role ${sessionUser.role} and status ${sessionUser.status} cannot access that resource.`
          )
        );
      }

      const { pagination, guilds } = await getAdminGuildsDB(queryData);
      const data = {
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        entries: pagination.entries,
        totalEntries: pagination.totalEntries,
        guilds,
      };
      return responseHandler(req, res, 200, data);
    } else {
      const { pagination, guilds } = await getPublicGuildsDB(queryData);
      const data = {
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        entries: pagination.entries,
        totalEntries: pagination.totalEntries,
        guilds,
      };
      return responseHandler(req, res, 200, data);
    }
  } catch (error) {
    const statusCode = (error as any).statusCode || 500;
    const detailedMessage = (error as any).message || 'Unknown error occurred';
    return next(
      new CustomError(
        'An unexpected error occurred. Please try again later.',
        statusCode,
        detailedMessage
      )
    );
  }
};

export default getGuilds;
