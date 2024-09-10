import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';

const getSessions = async (req: Request, res: Response) => {
  if (!req.sessionStore) {
    const error: ErrorReturn = {
      code: 404,
      message: 'Session store not found.',
    };
    return res.status(404).json(error);
  }

  req.sessionStore.all!((err, sessions) => {
    if (err) {
      const error: ErrorReturn = {
        code: (err as any).statusCode || (err as any).status || 500,
        message: (err as Error).message,
        stack: (err as Error).stack,
      };
      return res.status(error.code).json(error);
    }
    if (!sessions?.length) {
      const error: ErrorReturn = {
        code: 404,
        message: 'No sessions found.',
      };
      return res.status(404).json(error);
    }
    res.status(200).json(sessions);
  });
};

export default getSessions;
