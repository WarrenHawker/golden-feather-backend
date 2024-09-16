import { NextFunction, Request, Response } from 'express';
import getGuildTagsRedis from '../../../services/redis-services/tag-redis-services/get-guild-tags.service';
import getGuildTagsDB from '../../../services/db-services/tag-db-services/guild-tag-db-services/get-guild-tags.service';
import { CustomError } from '../../../types/custom-error';
import responseHandler from '../../../middleware/response-handler.middleware';
import checkActiveAdmin from '../../../utils/functions/check-admin.function';

const getGuildTags = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isAdmin = checkActiveAdmin(req);

  //try fetching tags from redis. If that fails, get tags from main database
  try {
    const { publicTags, allTags } = await getGuildTagsRedis();

    if (isAdmin) {
      return responseHandler(req, res, 200, allTags);
    }
    return responseHandler(req, res, 200, publicTags);
  } catch (error) {
    //fetch tags from main database
    try {
      const { publicTags, allTags } = await getGuildTagsDB();
      /*
        all tags will only be sent if the admin query is true and there 
        is a valid active admin session.  
      */
      if (isAdmin) {
        return responseHandler(req, res, 200, allTags);
      }
      return responseHandler(req, res, 200, publicTags);
    } catch (err) {
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
};

export default getGuildTags;
