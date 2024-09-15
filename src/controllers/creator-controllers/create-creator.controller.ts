import { NextFunction, Request, Response } from 'express';
import { createCreatorDB } from '../../services/db-services/creator-db-services/create-creator.service';
import responseHandler from '../../middleware/response-handler.middleware';
import { CustomError } from '../../types/custom-error';

const createCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newCreator, warningMessage } = await createCreatorDB(req.body);
    return responseHandler(req, res, 201, { newCreator, warningMessage });
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

export default createCreator;
