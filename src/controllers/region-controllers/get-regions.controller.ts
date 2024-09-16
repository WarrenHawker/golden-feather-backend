import { NextFunction, Request, Response } from 'express';
import getRegionsDB from '../../services/db-services/region-db-services/get-regions.service';
import getRegionsRedis from '../../services/redis-services/region-redis-services/get-regions-redis.service';
import responseHandler from '../../middleware/response-handler.middleware';
import { CustomError } from '../../types/custom-error';
import checkActiveAdmin from '../../utils/functions/check-admin.function';

const getregions = async (req: Request, res: Response, next: NextFunction) => {
  const isAdmin = checkActiveAdmin(req);

  //try fetching from redis. If that fails, get from main database
  try {
    const { publicRegions, allRegions } = await getRegionsRedis();
    if (isAdmin) {
      return responseHandler(req, res, 200, allRegions);
    }
    return responseHandler(req, res, 200, publicRegions);
  } catch (error) {
    //fetch from main database
    try {
      const { publicRegions, allRegions } = await getRegionsDB();
      if (isAdmin) {
        return responseHandler(req, res, 200, allRegions);
      }
      return responseHandler(req, res, 200, publicRegions);
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

export default getregions;
