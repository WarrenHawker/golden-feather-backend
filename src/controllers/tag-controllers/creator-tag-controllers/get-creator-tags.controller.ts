import { Request, Response } from 'express';
import getCreatorTagsRedis from '../../../services/redis-services/tag-redis-services/get-creator-tags-redis.service';
import { ErrorReturn } from '../../../types/error-return';
import { ISession } from '../../../types/express-session';
import getCreatorTagsDB from '../../../services/db-services/tag-db-services/creator-tag-db-services/get-creator-tags.service';

const getCreatorTags = async (req: Request, res: Response) => {
  const { admin } = req.query;
  const userSession = req.session as ISession;
  const isAdmin =
    admin === 'true' &&
    userSession.user.role === 'admin' &&
    userSession.user.status === 'active';
  //try fetching from redis. If that fails, get from main database
  try {
    const { publicTags, allTags } = await getCreatorTagsRedis();

    if (isAdmin) {
      return res.status(200).json(allTags);
    }
    return res.status(200).json(publicTags);
  } catch (error) {
    //fetch from main database
    try {
      const { publicTags, allTags } = await getCreatorTagsDB();
      if (isAdmin) {
        return res.status(200).json(allTags);
      }
      return res.status(200).json(publicTags);
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

export default getCreatorTags;
