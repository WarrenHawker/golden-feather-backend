import { NextFunction, Request, Response } from 'express';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import deleteUserDB from '../../services/db-services/user-db-services/delete-user.service';
import { CustomError } from '../../types/custom-error';
import responseHandler from '../../middleware/response-handler.middleware';

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!isValidCuid(id)) {
    return next(
      new CustomError('Invalid ID.', 400, `Invalid CUID provided: ${id}`)
    );
  }

  try {
    const deletedUser = await deleteUserDB(id as string);
    return responseHandler(req, res, 200, deletedUser);
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

export default deleteUser;
