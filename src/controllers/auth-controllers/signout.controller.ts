import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';

const signoutUser = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      const error: ErrorReturn = {
        code: (err as any).statusCode || (err as any).status || 500,
        message: (err as Error).message,
        stack: (err as Error).stack,
      };
      return res.status(error.code).json(error);
    }

    res.clearCookie('sessionId');
    return res.status(200).json({ message: 'success' });
  });
};

export default signoutUser;
