import { NextFunction, Request, Response } from 'express';
import getLanguagesRedis from '../../services/redis-services/language-redis-services/get-languages-redis.service';
import getLanguagesDB from '../../services/db-services/language-db-services/get-languages.service';
import { ISession } from '../../types/express-session';
import responseHandler from '../../middleware/response-handler.middleware';
import { CustomError } from '../../types/custom-error';

const getLanguages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSession = req.session as ISession;
  const isAdmin =
    userSession.user.role == 'admin' && userSession.user.status == 'active';
  //try fetching from redis. If that fails, get from main database
  try {
    const { publicLangs, allLangs } = await getLanguagesRedis();
    if (isAdmin) {
      return responseHandler(req, res, 200, allLangs);
    }
    return responseHandler(req, res, 200, publicLangs);
  } catch (error) {
    //fetch from main database
    try {
      const { publicLangs, allLangs } = await getLanguagesDB();
      if (isAdmin) {
        return responseHandler(req, res, 200, allLangs);
      }
      return responseHandler(req, res, 200, publicLangs);
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

export default getLanguages;
