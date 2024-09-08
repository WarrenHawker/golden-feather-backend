import { NextFunction, Request, Response } from 'express';
import ErrorReturn from '../types/error-return';
import { redisClient } from '../lib/redis/client.redis';

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
        const endpointResponse = await redisClient
          .multi()
          .incr(`${ip}_${endpoint}`)
          .expire(`${ip}_${endpoint}`, time)
          .exec();

        const endpointCount = endpointResponse[0];

        if ((endpointCount as number) > limit) {
          const error: ErrorReturn = {
            code: 429,
            message: 'Too many requests (endpoint)',
          };
          return res.status(429).json(error);
        }
      } else {
        const generalResponse = await redisClient
          .multi()
          .incr(`${ip}_general`)
          .expire(`${ip}_general`, defaultTime)
          .exec();

        const generalCount = generalResponse[0];

        if ((generalCount as number) > defaultLimit) {
          const error: ErrorReturn = {
            code: 429,
            message: 'Too many requests (general)',
          };
          return res.status(429).json(error);
        }
      }
      return next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      return res.status(500).json({
        code: 500,
        message: 'Internal server error',
      });
    }
  };
};

export default rateLimiter;
