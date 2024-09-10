import { Request, Response } from 'express';
import getCreatorTagsRedis from '../../../services/redis-services/tag-redis-services/get-creator-tags-redis.service';
import { ErrorReturn } from '../../../types/error-return';
import { ISession } from '../../../types/express-session';
import getCreatorTagsDB from '../../../services/db-services/tag-db-services/creator-tag-db-services/get-creator-tags.service';

const getCreatorTags = async (req: Request, res: Response) => {
  const { admin } = req.query;
  //try fetching tags from redis. If that fails, get tags from main database
  try {
    const { publicTags, allTags } = await getCreatorTagsRedis();

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
      const { publicTags, allTags } = await getCreatorTagsDB();
      const public_tags = publicTags.map((tag: { name: any }) => tag.name);
      const all_tags = allTags.map((tag: { name: any }) => tag.name);

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
        code: (err as any).statusCode || (err as any).status || 500,
        message: (err as Error).message,
        stack: (err as Error).stack,
      };
      return res.status(error.code).json(error);
    }
  }
};

export default getCreatorTags;
