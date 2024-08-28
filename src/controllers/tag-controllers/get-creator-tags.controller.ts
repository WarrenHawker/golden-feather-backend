import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { getCreatorTagsRedis } from '../../services/redis-services/get-creator-tags-redis.service';
import { getCreatorTagsDB } from '../../services/creator-db-services/get-creator-tags.service';

export const getCreatorTags = async (req: Request, res: Response) => {
  const { admin } = req.query;
  //try fetching tags from redis. If that fails, get tags from main database
  try {
    const { publicTags, adminTags } = await getCreatorTagsRedis();

    if (admin && admin == 'true') {
      return res.status(200).json(adminTags);
    } else {
      return res.status(200).json(publicTags);
    }
  } catch (error) {
    //fetch tags from main database
    try {
      const { publicTags, adminTags } = await getCreatorTagsDB();
      if (admin && admin == 'true') {
        return res.status(200).json(adminTags);
      } else {
        return res.status(200).json(publicTags);
      }
    } catch (err) {
      const error: ErrorReturn = {
        code: 500,
        message: (err as Error).message,
      };
      return res.status(500).json(error);
    }
  }
};
