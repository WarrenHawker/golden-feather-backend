import { NextFunction, Request, Response } from 'express';
import { UserRole, UserStatus } from '@prisma/client';
import { ISession } from '../types/express-session';
import { CustomError } from '../types/custom-error';

export const checkSession = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as ISession;
    if (!session || !session.user) {
      return next(
        new CustomError('Unauthorized access.', 401, 'No user session found.')
      );
    }
    next();
  };
};

export const checkRole = (requiredRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as ISession;
    if (session.user.role != requiredRole) {
      return next(
        new CustomError(
          'You do not have permission to access this resource.',
          403,
          `User with role ${session.user.role} does not have the required role: ${requiredRole}`
        )
      );
    }
    next();
  };
};

export const checkStatus = (requiredStatus: UserStatus) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as ISession;
    if (session.user.status != requiredStatus) {
      return next(
        new CustomError(
          'You do not have permission to access this resource.',
          403,
          `User with status ${session.user.status} does not have the required role: ${requiredStatus}`
        )
      );
    }

    next();
  };
};
