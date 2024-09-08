import { Request, Response } from 'express';
import ErrorReturn from '../../types/error-return';
import { ISession } from '../../types/express-session';
import createLog from '../../services/logger.service';
import getGuildBySlugDB from '../../services/db-services/guild-db-services/get-guild-by-slug.service';

const getGuildBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

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
    createLog('critical', req, res, error);
    return res.status(500).json(error);
  }
};

export default getGuildBySlug;
