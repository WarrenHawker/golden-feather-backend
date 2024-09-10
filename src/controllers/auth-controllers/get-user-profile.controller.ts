import { Request, Response } from 'express';
import { ISession } from '../../types/express-session';
import getUserByIdDB from '../../services/db-services/user-db-services/get-user-by-id.service';
import { ErrorReturn } from '../../types/error-return';

const getUserProfile = async (req: Request, res: Response) => {
  const userId = (req.session as ISession).user.id;
  try {
    const user = await getUserByIdDB(userId);

    if (!user) {
      const error: ErrorReturn = {
        code: 404,
        message: `User with ID ${userId} not found`,
      };
      return res.status(error.code).json(error);
    }
    return res.status(200).json(user);
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default getUserProfile;
