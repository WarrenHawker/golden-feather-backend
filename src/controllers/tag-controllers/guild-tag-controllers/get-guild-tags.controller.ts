import { Request, Response } from 'express';
import getGuildTagsRedis from '../../../services/redis-services/tag-redis-services/get-guild-tags.service';
import { ErrorReturn } from '../../../types/error-return';
import { ISession } from '../../../types/express-session';
import getGuildTagsDB from '../../../services/db-services/tag-db-services/guild-tag-db-services/get-guild-tags.service';

const getGuildTags = async (req: Request, res: Response) => {
  const { admin } = req.query;
  const userSession = req.session as ISession;
  const isAdmin =
    admin === 'true' &&
    userSession.user.role === 'admin' &&
    userSession.user.status === 'active';

  //try fetching tags from redis. If that fails, get tags from main database
  try {
    const { publicTags, allTags } = await getGuildTagsRedis();

    if (isAdmin) {
      return res.status(200).json(allTags);
    }
    return res.status(200).json(publicTags);
  } catch (error) {
    //fetch tags from main database
    try {
      const { publicTags, allTags } = await getGuildTagsDB();
      /*
        all tags will only be sent if the admin query is true and there 
        is a valid active admin session.  
      */
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

export default getGuildTags;
