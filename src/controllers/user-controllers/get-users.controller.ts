import { NextFunction, Request, Response } from 'express';
import getUsersDB from '../../services/db-services/user-db-services/get-users.service';
import responseHandler from '../../middleware/response-handler.middleware';
import { CustomError } from '../../types/custom-error';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pagination, users } = await getUsersDB(req.query);
    const data = {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      entries: pagination.entries,
      totalEntries: pagination.totalEntries,
      users,
    };
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

export default getUsers;
