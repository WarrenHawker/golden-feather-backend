import { NextFunction, Request, Response } from 'express';
import getCreatorTagsRedis from '../../../services/redis-services/tag-redis-services/get-creator-tags-redis.service';
import getCreatorTagsDB from '../../../services/db-services/tag-db-services/creator-tag-db-services/get-creator-tags.service';
import responseHandler from '../../../middleware/response-handler.middleware';
import { CustomError } from '../../../types/custom-error';
import checkActiveAdmin from '../../../utils/functions/check-admin.function';

const getCreatorTags = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isAdmin = checkActiveAdmin(req);
  //try fetching from redis. If that fails, get from main database
  try {
    const { publicTags, allTags } = await getCreatorTagsRedis();

    if (isAdmin) {
      return responseHandler(req, res, 200, allTags);
    }
    return responseHandler(req, res, 200, publicTags);
  } catch (error) {
    //fetch from main database
    try {
      const { publicTags, allTags } = await getCreatorTagsDB();
      if (isAdmin) {
        return responseHandler(req, res, 200, allTags);
      }
      return responseHandler(req, res, 200, publicTags);
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
};

export default getCreatorTags;
