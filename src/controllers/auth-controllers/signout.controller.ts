import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';

const signoutUser = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      const error: ErrorReturn = {
        code: 500,
        message: (err as Error).message,
      };
      return res.status(500).json(error);
    }

    res.clearCookie('sessionId');
    return res.status(200).json({ message: 'success' });
  });
};

export default signoutUser;
