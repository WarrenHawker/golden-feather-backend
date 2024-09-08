import { NextFunction, Request, Response } from 'express';
import { UserRole, UserStatus } from '@prisma/client';
import { ISession } from '../types/express-session';

export const checkSession = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as ISession;
    if (!session || !session.user) {
      const error: ErrorReturn = {
        code: 401,
        message: 'session not found',
      };
      return res.status(401).json(error);
    }
    next();
  };
};

export const checkRole = (requiredRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as ISession;
    if (session.user.role != requiredRole) {
      const error: ErrorReturn = {
        code: 403,
        message: 'user does not have the required role',
      };
      return res.status(403).json(error);
    }
    next();
  };
};

export const checkStatus = (requiredStatus: UserStatus) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as ISession;
    if (session.user.status != requiredStatus) {
      const error: ErrorReturn = {
        code: 403,
        message: 'user does not have the required status',
      };
      return res.status(403).json(error);
    }

    next();
  };
};
