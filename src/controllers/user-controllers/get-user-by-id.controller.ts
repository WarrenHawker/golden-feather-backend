import { NextFunction, Request, Response } from 'express';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import getUserByIdDB from '../../services/db-services/user-db-services/get-user-by-id.service';
import { CustomError } from '../../types/custom-error';
import responseHandler from '../../middleware/response-handler.middleware';

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!isValidCuid(id)) {
    return next(
      new CustomError('Invalid ID.', 400, `Invalid CUID provided: ${id}`)
    );
  }

  try {
    const user = await getUserByIdDB(id as string);
    if (!user) {
      return next(
        new CustomError(
          'The requested resource could not be found.',
          404,
          `User with id ${id} not found in database.`
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

export default getUserById;
