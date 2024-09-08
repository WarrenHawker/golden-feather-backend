import { Request, Response } from 'express';
import ErrorReturn from '../../types/error-return';
import getGuildTagsRedis from '../../services/redis-services/guild-redis-services/get-guild-tags.service';
import { ISession } from '../../types/express-session';
import createLog from '../../services/logger.service';
import getGuildTagsDB from '../../services/db-services/guild-db-services/get-guild-tags.service';

const getGuildTags = async (req: Request, res: Response) => {
  const { admin } = req.query;
  //try fetching tags from redis. If that fails, get tags from main database
  try {
    const { publicTags, allTags } = await getGuildTagsRedis();

    if (
      admin &&
      admin == 'true' &&
      ((req.session as ISession).user.role != 'admin' ||
        (req.session as ISession).user.status != 'active')
    ) {
      return res.status(200).json(allTags);
    } else {
      return res.status(200).json(publicTags);
    }
  } catch (error) {
    //fetch tags from main database
    try {
      const { publicTags, allTags } = await getGuildTagsDB();
      const public_tags = publicTags.map((tag) => tag.name);
      const all_tags = allTags.map((tag) => tag.name);

      /*
        all tags will only be sent if the admin query is true and there 
        is a valid active admin session.  
      */
      if (
        admin &&
        admin == 'true' &&
        ((req.session as ISession).user.role != 'admin' ||
          (req.session as ISession).user.status != 'active')
      ) {
        return res.status(200).json(all_tags);
      } else {
        return res.status(200).json(public_tags);
      }
    } catch (err) {
      const error: ErrorReturn = {
        code: 500,
        message: (err as Error).message,
      };
      createLog('critical', req, res, error);
      return res.status(500).json(error);
    }
  }
};

export default getGuildTags;
