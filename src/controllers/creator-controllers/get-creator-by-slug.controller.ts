import { Request, Response } from 'express';
import { ISession } from '../../types/express-session';
import { getCreatorBySlugDB } from '../../services/db-services/creator-db-services/get-creator-by-slug.service';
import { ErrorReturn } from '../../types/error-return';

const getCreatorBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const creator = await getCreatorBySlugDB(slug as string);

    if (!creator) {
      const error: ErrorReturn = {
        code: 404,
        message: 'creator not found',
      };
      return res.status(404).json(error);
    }

    /*
      If the creator is not "public" it can only be accessed by admins.
      Check if there is a valid active admin session before returning 
      the creator object. If the session is invalid, return a 404 not found.
    */

    if (creator.status != 'public') {
      const sessionUser = (req.session as ISession).user;
      if (
        !sessionUser ||
        sessionUser.role != 'admin' ||
        sessionUser.status != 'active'
      ) {
        const error: ErrorReturn = {
          code: 404,
          message: 'creator not found',
        };
        return res.status(404).json(error);
      }
    }

    return res.status(200).json(creator);
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default getCreatorBySlug;
