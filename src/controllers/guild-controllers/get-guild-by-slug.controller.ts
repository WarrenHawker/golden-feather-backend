import { NextFunction, Request, Response } from 'express';
import { ISession } from '../../types/express-session';
import getGuildBySlugDB from '../../services/db-services/guild-db-services/get-guild-by-slug.service';
import { escape } from 'validator';
import { CustomError } from '../../types/custom-error';
import responseHandler from '../../middleware/response-handler.middleware';

const getGuildBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { slug } = req.params;

  slug = escape(slug).trim();

  try {
    const guild = await getGuildBySlugDB(slug as string);
    if (!guild) {
      return next(
        new CustomError(
          'The requested resource could not be found.',
          404,
          `Guild with slug ${slug} not found in database.`
        )
      );
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
        return next(
          new CustomError(
            'The requested resource could not be found.',
            404,
            `User doesn't have access to Guild with slug ${slug}.`
          )
        );
      }
    }

    return responseHandler(req, res, 200, guild);
  } catch (error) {
    const statusCode = (error as any).statusCode || 500;
    const detailedMessage = (error as any).message || 'Unknown error occurred';
    return next(
      new CustomError(
        'An unexpected error occurred. Please try again later.',
        statusCode,
        detailedMessage
      )
    );
  }
};

export default getGuildBySlug;
