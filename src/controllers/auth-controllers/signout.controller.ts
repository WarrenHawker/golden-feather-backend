import { Request, Response } from 'express';
import createLog from '../../services/logger.service';
import ErrorReturn from '../../types/error-return';

const signoutUser = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      const error: ErrorReturn = {
        code: 500,
        message: (err as Error).message,
      };
      createLog('critical', req, res, error);
      return res.status(500).json(error);
    }

    res.clearCookie('sessionId');
    res.send('Logout successful');
  });
};

export default signoutUser;
