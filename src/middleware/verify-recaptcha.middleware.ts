import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { ErrorReturn } from '../types/error-return';

const verifyRecaptcha = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { captchaToken } = req.body;

  if (!captchaToken) {
    const error: ErrorReturn = {
      code: 400,
      message: 'Missing captchaToken',
      params: ['captchaToken'],
    };
    return res.status(error.code).json(error);
  }

  const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;

  try {
    const captchaResponse = await axios.post(recaptchaVerifyUrl);

    if (!captchaResponse.data.success) {
      const error: ErrorReturn = {
        code: 400,
        message: 'Captcha verification failed',
        params: ['captchaToken'],
      };
      return res.status(error.code).json(error);
    }

    const score = captchaResponse.data.score;
    if (score !== undefined && score < 0.5) {
      const error: ErrorReturn = {
        code: 400,
        message: 'Captcha verification score too low',
        params: ['captchaToken'],
      };
      return res.status(error.code).json(error);
    }
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).response?.status || 500,
      message: (err as any).response?.data?.message || 'Internal server error',
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }

  next();
};

export default verifyRecaptcha;
