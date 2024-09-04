import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { getGuildBySlugDB } from '../../services/guild-db-services/get-guild-by-slug.service';
import { ISession } from '../../types/express-session';

export const getGuildBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (!slug) {
    const error: ErrorReturn = {
      code: 400,
      message: 'no slug search param found',
    };
    return res.status(400).json(error);
  }

  try {
    const guild = await getGuildBySlugDB(slug as string);
    if (!guild) {
      const error: ErrorReturn = {
        code: 404,
        message: 'guild not found',
      };
      return res.status(404).json(error);
    }

    /*
      If the guild is not "public" it can only be accessed by admins.
      Check if there is a valid active admin session before returning 
      the guild object. If the session is invalid, return a 404 not found.
    */

    if (guild.status != 'public') {
      const sessionUser = (req.session as ISession).user;
      if (
        !sessionUser ||
        sessionUser.role != 'admin' ||
        sessionUser.status != 'active'
      ) {
        const error: ErrorReturn = {
          code: 404,
          message: 'guild not found',
        };
        return res.status(404).json(error);
      }
    }

    return res.status(200).json(guild);
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    return res.status(500).json(error);
  }
};
