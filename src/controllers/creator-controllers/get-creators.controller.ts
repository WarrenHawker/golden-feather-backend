import { NextFunction, Request, Response } from 'express';
import getCreatorsRedis from '../../services/redis-services/creator-redis-services/get-creators-redis.service';
import storeCreatorsRedis from '../../services/redis-services/creator-redis-services/store-creators-redis.service';
import { ISession } from '../../types/express-session';
import { getAdminCreatorsDB } from '../../services/db-services/creator-db-services/get-admin-creators.service';
import { getPublicCreatorsDB } from '../../services/db-services/creator-db-services/get-public-creators.service';
import responseHandler from '../../middleware/response-handler.middleware';
import { CustomError } from '../../types/custom-error';
import { CreatorSearchParams } from '../../types/creator';
import { ContentStatus } from '@prisma/client';
import queryToArray from '../../utils/functions/query-to-array.function';

const getCreators = async (req: Request, res: Response, next: NextFunction) => {
  //if no search params are given, try fetching the default creators from redis.
  if (Object.keys(req.query).length == 0) {
    try {
      const redisCreators = await getCreatorsRedis();
      return responseHandler(req, res, 200, redisCreators);
    } catch (error) {
      //if fetching data from redis fails, try fetching data from main database
      try {
        const { pagination, creators } = await getPublicCreatorsDB();
        await storeCreatorsRedis({ pagination, creators });
        const data = {
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          entries: pagination.entries,
          totalEntries: pagination.totalEntries,
          creators,
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

  const { admin, page, limit, name, lang, tag, status } = req.query;

  const queryData: CreatorSearchParams = {
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
    name: name ? (name as string) : undefined,
    languages: queryToArray(lang),
    tags: queryToArray(tag),
    status: status ? (status as ContentStatus) : undefined,
  };

  //fetch data from main database. If admin search param is true,
  //fetch admin creators, otherwise fetch public creators
  //fetching admin creators can only be done if there is a valid active admin session
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

      const { pagination, creators } = await getAdminCreatorsDB(queryData);
      const data = {
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        entries: pagination.entries,
        totalEntries: pagination.totalEntries,
        creators,
      };
      return responseHandler(req, res, 200, data);
    } else {
      const { pagination, creators } = await getPublicCreatorsDB(queryData);
      const data = {
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        entries: pagination.entries,
        totalEntries: pagination.totalEntries,
        creators,
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

export default getCreators;
