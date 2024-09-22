import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../types/custom-error';
import { IOredisClient } from '../lib/redis/client.redis';
/* 
  This rate limiter takes in a limit, a time (in milliseconds) and an 
  optional endpoint, used for more restricted endpoints like /signin.

  The default version of the function (generalResponse) is applied
  globally to all endpoints. 

  More restricted endpoints like /signin have an additional rate limit
  that will get applied in addition to the general rate limit. 
*/

const defaultTime = 60; //default 1 min
const defaultLimit = 100;

const rateLimiter = (
  limit: number = defaultLimit,
  time: number = defaultTime,
  endpoint: string | null = null
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || 'unknown';

      if (endpoint) {
        const endpointResponse = await IOredisClient!
          .multi()
          .incr(`${ip}_${endpoint}`)
          .expire(`${ip}_${endpoint}`, time)
          .exec();

        const endpointCount = endpointResponse![0];

        if ((endpointCount as unknown as number) > limit) {
          return next(
            new CustomError(
              'Too many requests. Please slow down and try again later.',
              429,
              `Rate limit exceeded from IP ${ip} at endpoint ${endpoint}.`
            )
          );
        }
      } else {
        const generalResponse = await IOredisClient!
          .multi()
          .incr(`${ip}_general`)
          .expire(`${ip}_general`, defaultTime)
          .exec();
        if (generalResponse == null) {
          console.error('error executing multi-command redis');
          return;
        }

        const [error, generalCount] = generalResponse[0];

        if (error) {
          console.error(error);
        }

        if (parseInt(generalCount as string) > defaultLimit) {
          return next(
            new CustomError(
              'Too many requests. Please slow down and try again later.',
              429,
              `General Rate limit exceeded from IP ${ip}.`
            )
          );
        }
      }
      return next();
    } catch (error) {
      const statusCode = (error as any).statusCode || 500;
      const detailedMessage =
        (error as any).message || 'Unknown error occurred';
      return next(
        new CustomError(
          'An unexpected error occurred. Please try again later.',
          statusCode,
          detailedMessage
        )
      );
    }
  };
};

export default rateLimiter;
