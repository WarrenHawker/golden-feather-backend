import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../types/custom-error';
import { redisClient } from '../lib/redis/client.redis';
import lockAccount from '../services/auth-services/lock-account.service';
import prismaClient from '../lib/prisma/client.prisma';

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
  const { captchaTokenV3, captchaTokenV2, email } = req.body;

  const isBlacklisted = await redisClient.get(`ip_blacklist:${req.ip}`);
  if (isBlacklisted) {
    return res.status(403).json({
      message:
        'Your IP has been temporarily blacklisted due to too many failed attempts. Try again later.',
    });
  }

  // Helper function to handle errors and set captcha result
  const handleRecaptchaFailure = async (
    message: string,
    logMessage: string,
    statusCode: number,
    result: string
  ) => {
    // Set the captcha result early in res.locals so the logger can pick it up
    res.locals.captchaResult = result;

    const failures = await redisClient.incr(
      `captchaFailures:${email || req.ip}`
    );

    if (failures === 1) {
      await redisClient.expire(`captchaFailures:${email || req.ip}`, 60 * 60); // 1-hour expiration
    }

    const maxCaptchaFailures = 5;
    if (failures >= maxCaptchaFailures) {
      const user = await prismaClient.user.findUnique({ where: { email } });
      if (user) {
        await lockAccount(user);
        return next(
          new CustomError(
            'Your account has been temporarily locked due to too many failed verification attempts.',
            403,
            `Account locked after ${failures} failed reCAPTCHA attempts.`
          )
        );
      } else {
        await redisClient.set(`ip_blacklist:${req.ip}`, 'blacklisted', {
          EX: 24 * 60 * 60,
        }); // Blacklist for 24 hours
        return next(
          new CustomError(
            'Your IP has been temporarily blacklisted due to too many failed attempts. Try again later.',
            403,
            `IP ${req.ip} blacklisted after ${failures} failed reCAPTCHA attempts.`
          )
        );
      }
    }
    return next(new CustomError(message, statusCode, logMessage));
  };

  // Use v3 verification if v3 token is present
  if (captchaTokenV3) {
    const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_V3}&response=${captchaTokenV3}`;

    try {
      const captchaResponse = await axios.post(recaptchaVerifyUrl);

      if (!captchaResponse.data.success) {
        return handleRecaptchaFailure(
          'Failed to verify reCAPTCHA. Please try again.',
          `reCAPTCHA v3 verification failed for token: ${captchaTokenV3}`,
          400,
          'captchaV3 failed'
        );
      }

      const score = captchaResponse.data.score;
      if (score !== undefined && score < 0.4) {
        res.locals.captchaResult = `captchaV3 score: ${score}`;
        return handleRecaptchaFailure(
          'reCAPTCHA verification failed. Please try again.',
          `reCAPTCHA v3 score too low (${score}) for token: ${captchaTokenV3}`,
          403,
          `captchaV3 score: ${score}`
        );
      }

      if (score >= 0.4 && score <= 0.7) {
        res.locals.captchaResult = `captchaV3 score: ${score}`;
        return handleRecaptchaFailure(
          'Please verify that you are not a robot.',
          `Suspicious reCAPTCHA v3 score: ${score}. Further verification needed.`,
          401,
          `captchaV3 score: ${score}`
        );
      }

      // If score > 0.7, captcha verification succeeds, set result
      res.locals.captchaResult = `captchaV3 score: ${score} (success)`;
    } catch (error) {
      return next(
        new CustomError(
          'An unexpected error occurred. Please try again later.',
          (error as any).statusCode || 500,
          (error as any).message || 'Unknown error occurred'
        )
      );
    }
  }

  // Use v2 verification if v2 token is present
  if (captchaTokenV2) {
    const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_V2}&response=${captchaTokenV2}`;

    try {
      const captchaResponse = await axios.post(recaptchaVerifyUrl);

      if (!captchaResponse.data.success) {
        res.locals.captchaResult = 'captchaV2 failed';
        return handleRecaptchaFailure(
          'Failed to verify reCAPTCHA. Please try again.',
          `reCAPTCHA v2 verification failed for token: ${captchaTokenV2}`,
          400,
          'captchaV2 failed'
        );
      }

      // If verification succeeds, set result
      res.locals.captchaResult = 'captchaV2 success';
    } catch (error) {
      return next(
        new CustomError(
          'An unexpected error occurred. Please try again later.',
          (error as any).statusCode || 500,
          (error as any).message || 'Unknown error occurred'
        )
      );
    }
  }

  // If neither v3 nor v2 token is present, proceed to the next middleware or controller
  next();
};

export default verifyRecaptcha;
