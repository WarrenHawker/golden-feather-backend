import { NextFunction, Request, Response } from 'express';
import { ISession } from '../../types/express-session';
import getUserByIdDB from '../../services/db-services/user-db-services/get-user-by-id.service';
import { CustomError } from '../../types/custom-error';
import responseHandler from '../../middleware/response-handler.middleware';

const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req.session as ISession).user.id;
  try {
    const user = await getUserByIdDB(userId);

    if (!user) {
      return next(
        new CustomError(
          'The requested resource could not be found.',
          404,
          `User with id ${userId} not found in database.`
        )
      );
    }
    return responseHandler(req, res, 200, user);
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

export default getUserProfile;
