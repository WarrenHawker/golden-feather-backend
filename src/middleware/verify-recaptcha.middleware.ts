import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { ErrorReturn } from '../types/error-return';

/* 
  Google ReCaptcha verification
  Used on all endpoints from form submissions

  Starts with ReCaptcha v3 verification, which returns 
  either a failure or a score between 0 and 1:
  
  If the score is lower than 0.4, it is likely a bot and will be blocked
  
  If the score is between 0.4 and 0.7 it is suspicious and extra verification
  is needed using reCaptcha v2

  If the score is higher than 0.7 it is allowed and goes to the controller

  If v2 verification is needed, the client will pass a new token and this is
  done on a pass or fail. If it fails, the request is blocked. If it succeeds, 
  it moves onto the controller. 
*/

const verifyRecaptcha = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { captchaTokenV3, captchaTokenV2 } = req.body;

  // Use v3 verification if v3 token is present
  if (captchaTokenV3) {
    const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_V3}&response=${captchaTokenV3}`;

    try {
      const captchaResponse = await axios.post(recaptchaVerifyUrl);

      if (!captchaResponse.data.success) {
        const error: ErrorReturn = {
          code: 400,
          message: 'Captcha verification failed',
        };
        return res.status(error.code).json(error);
      }

      const score = captchaResponse.data.score;

      // Block if score is too low (likely bot)
      if (score !== undefined && score < 0.4) {
        const error: ErrorReturn = {
          code: 403,
          message: 'Request blocked due to suspicious activity.',
          recaptchaScore: score,
        };
        return res.status(error.code).json(error);
      }

      // Request further verification if score is suspicious
      if (score >= 0.4 && score <= 0.7) {
        const error: ErrorReturn = {
          code: 403,
          message:
            'Further verification needed. Please complete an additional step (reCAPTCHA v2).',
          recaptchaScore: score,
        };
        return res.status(error.code).json(error);
      }

      // If the score is greater than 0.7, proceed to the controller
    } catch (err) {
      const error: ErrorReturn = {
        code: (err as any).response?.status || 500,
        message:
          (err as any).response?.data?.message || 'Internal server error',
        stack: (err as Error).stack,
      };
      return res.status(error.code).json(error);
    }
  }

  // Use v2 verification if v2 token is present
  if (captchaTokenV2) {
    const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_V2}&response=${captchaTokenV2}`;

    try {
      const captchaResponse = await axios.post(recaptchaVerifyUrl);

      if (!captchaResponse.data.success) {
        const error: ErrorReturn = {
          code: 400,
          message: 'Captcha verification failed',
        };
        return res.status(error.code).json(error);
      }

      // If v2 verification succeeds, proceed to the controller
    } catch (err) {
      const error: ErrorReturn = {
        code: (err as any).response?.status || 500,
        message:
          (err as any).response?.data?.message || 'Internal server error',
        stack: (err as Error).stack,
      };
      return res.status(error.code).json(error);
    }
  }

  // If both verifications pass or neither are required, proceed to the controller
  next();
};

export default verifyRecaptcha;
