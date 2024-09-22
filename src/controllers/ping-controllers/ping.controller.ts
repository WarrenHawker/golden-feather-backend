import responseHandler from '../../middleware/response-handler.middleware';
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../types/custom-error';

const pingServer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    responseHandler(req, res, 200);
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

export default pingServer;
