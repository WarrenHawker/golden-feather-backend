import { NextFunction, Request, Response } from 'express';
import { redisClient } from '../lib/redis/client.redis';
import createLog from '../services/logger.service';
import ErrorReturn from '../types/error-return';
import { promisify } from 'util';

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

const rateLimiter = (limit: number, time: number) => {
  //time is in milliseconds
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const currentTime = Date.now();

    try {
      const data = await getAsync(ip);
      if (data) {
        const { count, lastRequest } = JSON.parse(data);
        const timeDifference = currentTime - lastRequest;

        if (timeDifference < time) {
          if (count >= limit) {
            const error: ErrorReturn = {
              code: 429,
              message: 'too many requests',
            };
            createLog('error', req, res, error);
            return res.status(429).json(error);
          }
          await setAsync(
            ip,
            JSON.stringify({
              count: count + 1,
              lastRequest: currentTime,
            }),
            'PX',
            time
          );
        } else {
          await setAsync(
            ip,
            JSON.stringify({
              count: 1,
              lastRequest: currentTime,
            }),
            'PX',
            time
          );
        }
      } else {
        await setAsync(
          ip,
          JSON.stringify({
            count: 1,
            lastRequest: currentTime,
          }),
          'PX',
          time
        );
      }
      next();
    } catch (error) {
      throw error;
    }
  };
};

export default rateLimiter;
