//TODO fill in function

import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import axios from 'axios';

const receiveContactForm = async (req: Request, res: Response) => {
  let { name, email, message, captchaToken } = req.body;
  const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;

  try {
    const captchaResponse = await axios.post(recaptchaVerifyUrl);
    console.log(captchaResponse.data);
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
