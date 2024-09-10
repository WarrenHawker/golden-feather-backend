import { Request, Response } from 'express';
import getLanguagesRedis from '../../services/redis-services/language-redis-services/get-languages-redis.service';
import getLanguagesDB from '../../services/db-services/language-db-services/get-languages.service';
import { ErrorReturn } from '../../types/error-return';
import { ISession } from '../../types/express-session';

const getLanguages = async (req: Request, res: Response) => {
  const { admin } = req.query;
  const userSession = req.session as ISession;
  const isAdmin =
    admin === 'true' &&
    userSession.user.role === 'admin' &&
    userSession.user.status === 'active';
  //try fetching from redis. If that fails, get from main database
  try {
    const { publicLangs, allLangs } = await getLanguagesRedis();
    if (isAdmin) {
      return res.status(200).json(allLangs);
    }
    return res.status(200).json(publicLangs);
  } catch (error) {
    //fetch from main database
    try {
      const { publicLangs, allLangs } = await getLanguagesDB();
      if (isAdmin) {
        return res.status(200).json(allLangs);
      }
      return res.status(200).json(publicLangs);
    } catch (err) {
      const error: ErrorReturn = {
        code: (err as any).statusCode || (err as any).status || 500,
        message: (err as Error).message,
        stack: (err as Error).stack,
      };
      return res.status(error.code).json(error);
    }
  }
};

export default getLanguages;
