import { NextFunction, Request, Response } from 'express';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import { ISession } from '../../types/express-session';
import updateGuildDB from '../../services/db-services/guild-db-services/update-guild.service';
import getUserContent from '../../services/db-services/user-db-services/get-user-content.service';
import { CustomError } from '../../types/custom-error';

const updateGuild = async (req: Request, res: Response, next: NextFunction) => {
  const { id: guildId } = req.params;

  if (!isValidCuid(guildId)) {
    return next(
      new CustomError('Invalid ID.', 400, `Invalid CUID provided: ${guildId}`)
    );
  }

  /* 
    guilds can only be updated by admins or the linked user.
    check for a valid session before continuing.
  */
  try {
    const sessionUser = (req.session as ISession).user;

    const { userGuildId } = await getUserContent(sessionUser.id);
    if (
      !userGuildId ||
      userGuildId != guildId ||
      !(sessionUser.role == 'admin' && sessionUser.status == 'active')
    ) {
      return next(
        new CustomError(
          'You do not have permission to access this resource.',
          403,
          `User id ${userGuildId}, role ${sessionUser.role} and status ${sessionUser.status} cannot access that resource.`
        )
      );
    }
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

  //assuming session is valid, continue with rest of function
  try {
    const { updatedGuild, warningMessage } = await updateGuildDB(
      guildId as string,
      req.body
    );
    return res.status(200).json({ updatedGuild, warningMessage });
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

export default updateGuild;
