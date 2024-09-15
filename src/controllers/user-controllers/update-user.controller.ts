import { NextFunction, Request, Response } from 'express';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import bcrypt from 'bcrypt';
import { ISession } from '../../types/express-session';
import updateUserDB from '../../services/db-services/user-db-services/update-user.service';
import { CustomError } from '../../types/custom-error';
import responseHandler from '../../middleware/response-handler.middleware';

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id: userId } = req.params;
  let { password, role, status, guildId, creatorId } = req.body;

  /* 
    user profiles can only be updated by admins or the signed in user.
    check for a valid session before continuing.

    In addition, only admins can change the guildId, creatorId, role and status of a user.
  */

  if (!isValidCuid(userId)) {
    return next(
      new CustomError('Invalid ID.', 400, `Invalid CUID provided: ${userId}`)
    );
  }

  const sessionUser = (req.session as ISession).user;
  try {
    if (
      sessionUser.id != userId &&
      !(sessionUser.role == 'admin' && sessionUser.status == 'active')
    ) {
      return next(
        new CustomError(
          'You do not have permission to access this resource.',
          403,
          `User id ${userId}, role ${sessionUser.role} and status ${sessionUser.status} cannot access that resource.`
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

  try {
    if (guildId) {
      //check for valid admin session
      if (!(sessionUser.role == 'admin' && sessionUser.status == 'active')) {
        return next(
          new CustomError(
            'You do not have permission to change this resource.',
            403,
            `User id ${userId}, role ${sessionUser.role} and status ${sessionUser.status} cannot change that resource.`
          )
        );
      } else if (!isValidCuid(guildId as string)) {
        return next(
          new CustomError(
            'You do not have permission to change this resource.',
            403,
            `GuildId ${guildId} is invalid.`
          )
        );
      }
    }

    if (creatorId) {
      //check for valid admin session
      if (!(sessionUser.role == 'admin' && sessionUser.status == 'active')) {
        return next(
          new CustomError(
            'You do not have permission to change this resource.',
            403,
            `User id ${userId}, role ${sessionUser.role} and status ${sessionUser.status} cannot change that resource.`
          )
        );
      } else if (!isValidCuid(creatorId as string)) {
        return next(
          new CustomError(
            'You do not have permission to change this resource.',
            403,
            `creatorId ${creatorId} is invalid.`
          )
        );
      }
    }

    if (status) {
      //check for valid admin session
      if (!(sessionUser.role == 'admin' && sessionUser.status == 'active')) {
        return next(
          new CustomError(
            'You do not have permission to change this resource.',
            403,
            `User id ${userId}, role ${sessionUser.role} and status ${sessionUser.status} cannot change that resource.`
          )
        );
      }
    }

    if (role) {
      //check for valid admin session
      if (!(sessionUser.role == 'admin' && sessionUser.status == 'active')) {
        return next(
          new CustomError(
            'You do not have permission to change this resource.',
            403,
            `User id ${userId}, role ${sessionUser.role} and status ${sessionUser.status} cannot change that resource.`
          )
        );
      }
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      password = hashedPassword;
    }

    const { updatedUser, warningMessage1, warningMessage2 } =
      await updateUserDB(userId as string, req.body);
    const data = { updatedUser, warnings: [warningMessage1, warningMessage2] };
    return responseHandler(req, res, 200, data);
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

export default updateUser;
