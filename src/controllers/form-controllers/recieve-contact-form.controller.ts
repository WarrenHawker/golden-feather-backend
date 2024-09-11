//TODO fill in function

import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';

const receiveContactForm = async (req: Request, res: Response) => {
  let { name, email, message } = req.body;
  try {
    return res.status(200).json(req.body);
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default receiveContactForm;
