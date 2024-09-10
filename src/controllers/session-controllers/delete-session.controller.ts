import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';

const deleteSession = async (req: Request, res: Response) => {
  const sessionId = req.params.id;

  const missingParams = [];
  if (!sessionId) {
    missingParams.push('userId');
  }
  if (missingParams.length > 0) {
    const error: ErrorReturn = {
      code: 400,
      message: 'Missing url parameters',
      params: missingParams,
    };
    return res.status(400).json(error);
  }

  if (!req.sessionStore) {
    const error: ErrorReturn = {
      code: 404,
      message: 'Session store not found.',
    };
    return res.status(404).json(error);
  }

  req.sessionStore.destroy(sessionId, (err) => {
    if (err) {
      const error: ErrorReturn = {
        code: (err as any).statusCode || (err as any).status || 500,
        message: (err as Error).message,
        stack: (err as Error).stack,
      };
      return res.status(error.code).json(error);
    }
    res.sendStatus(200).json({ message: 'session destroyed successfully' });
  });
};

export default deleteSession;
