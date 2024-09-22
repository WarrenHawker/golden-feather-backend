import { CustomError } from '../types/custom-error';
import { NextFunction, Request, Response } from 'express';

const authHeaderMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return next(
      new CustomError(
        'Unauthorized access.',
        401,
        'No authorization header found.'
      )
    );
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(
      new CustomError(
        'Unauthorized access.',
        401,
        'Invalid Authorization header format.'
      )
    );
  }

  if (token != process.env.HEALTH_CHECK_TOKEN) {
    return next(
      new CustomError(
        'Unauthorized access.',
        401,
        'Authorization header token does not match key.'
      )
    );
  }
  next();
};

export default authHeaderMiddleware;
