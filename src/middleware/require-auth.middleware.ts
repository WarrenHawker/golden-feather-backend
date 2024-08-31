import { NextFunction, Request, Response } from 'express';
import { UserRole, UserStatus } from '@prisma/client';
import { ISession } from '../types/express-session';
import { ErrorReturn } from '../types/error-return';
import { createLog } from '../services/logger.service';

export const checkRole = (requiredRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as ISession;
    console.log(session);
    if (!session || !session.clientId) {
      const error: ErrorReturn = {
        code: 401,
        message: 'session not found',
      };
      createLog('error', req, res, error);
      return res.status(401).json(error);
    }

    if (session.role != requiredRole) {
      const error: ErrorReturn = {
        code: 403,
        message: 'user does not have the required role',
      };
      createLog('error', req, res, error);
      return res.status(403).json(error);
    }
    next();
  };
};

export const checkStatus = (requiredStatus: UserStatus) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as ISession;
    if (!session || !session.clientId) {
      const error: ErrorReturn = {
        code: 401,
        message: 'session not found',
      };
      createLog('error', req, res, error);
      return res.status(401).json(error);
    }

    if (session.status != requiredStatus) {
      const error: ErrorReturn = {
        code: 403,
        message: 'user does not have the required status',
      };
      createLog('error', req, res, error);
      return res.status(403).json(error);
    }

    next();
  };
};
