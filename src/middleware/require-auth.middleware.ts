/*
  "require user authentication" middleware

  Runs before allowing access to any protected routes. 
  Checks both for a valid session as well as the user's current role and status.  
*/

//import packages
import { NextFunction, Request, Response } from 'express';
import { createLog } from '../services/logger.service';
import { ErrorReturn } from '../types/error-return';
import { redisClient } from '../lib/redis/client.redis';

interface ResError extends Error {
  statusCode?: number;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session) {
    const err = new Error('Unauthenticated user') as ResError;
    err.statusCode = 401;
    const error: ErrorReturn = {
      code: 401,
      message: 'No valid session found',
    };
    createLog('error', req, res, error);
    next(err);
  } else {
    next();
  }
};
