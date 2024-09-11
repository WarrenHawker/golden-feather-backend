import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { ErrorReturn } from '../types/error-return';

const verifyRecaptcha = async () => {
  console.log('hello?');
  return async (req: Request, res: Response, next: NextFunction) => {
    const { captchaToken } = req.body;
    const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;

    try {
      const captchaResponse = await axios.post(recaptchaVerifyUrl);

      if (!captchaResponse.data.success) {
        const error: ErrorReturn = {
          code: 400,
          message: 'Invalid or missing captchaToken',
          params: ['captchaToken'],
        };
        return res.status(error.code).json(error);
      }
    } catch (err) {
      const error: ErrorReturn = {
        code: (err as any).statusCode || (err as any).status || 500,
        message: (err as Error).message,
        stack: (err as Error).stack,
      };
      return res.status(error.code).json(error);
    }
    next();
  };
};

export default verifyRecaptcha;
