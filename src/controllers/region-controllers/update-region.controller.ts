//TODO fill in function

import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';

const updateRegion = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default updateRegion;
