import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import getRegionsDB from '../../services/db-services/region-db-services/get-regions.service';
import getRegionsRedis from '../../services/redis-services/region-redis-services/get-regions-redis.service';
import { ISession } from '../../types/express-session';

const getregions = async (req: Request, res: Response) => {
  const { admin } = req.query;
  const userSession = req.session as ISession;
  const isAdmin =
    admin === 'true' &&
    userSession.user.role === 'admin' &&
    userSession.user.status === 'active';
  //try fetching from redis. If that fails, get from main database
  try {
    const { publicRegions, allRegions } = await getRegionsRedis();
    if (isAdmin) {
      return res.status(200).json(allRegions);
    }
    return res.status(200).json(publicRegions);
  } catch (error) {
    //fetch from main database
    try {
      const { publicRegions, allRegions } = await getRegionsDB();
      if (isAdmin) {
        return res.status(200).json(allRegions);
      }
      return res.status(200).json(publicRegions);
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

export default getregions;
