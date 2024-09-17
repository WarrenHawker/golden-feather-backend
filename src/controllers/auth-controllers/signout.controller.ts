import { NextFunction, Request, Response } from 'express';
import responseHandler from '../../middleware/response-handler.middleware';
import { CustomError } from '../../types/custom-error';

const signoutUser = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.session);
  try {
    req.session.destroy(() => {
      res.clearCookie('sessionId');
      return responseHandler(req, res, 200);
    });
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

export default signoutUser;
