import { NextFunction, Request, Response } from 'express';
import { redisClient } from '../lib/redis/client.redis';
import { createLog } from '../services/logger.service';
import { ErrorReturn } from '../types/error-return';

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.socket.remoteAddress;
  if (ip) {
    //if there's a valid ip address, update total number of request attempts and check if the limit has been reached
    const response = await redisClient.multi().incr(ip).expire(ip, 60).exec();
    if ((response[0] as number) > 100) {
      //TODO change limit to 10 for production
      const error: ErrorReturn = {
        code: 429,
        message: 'Too many requests',
      };
      res.status(429).json(error);
      createLog('error', req, res, error);
      return;
    }
  } else throw new Error('ip address not found');
  next();
};

export const signinRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.socket.remoteAddress;
  const { email } = req.body;

  if (!ip) {
    return res.status(400).json({ error: 'IP address not found' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const key = `signin:${ip}:${email}`;

  try {
    const response = await redisClient
      .multi()
      .incr(key)
      .expire(key, 60) // Expire key after 60 seconds
      .exec();

    // Type assertion to tell TypeScript what to expect
    const incrResult = response[0] as [Error | null, number];
    const requestCount = incrResult[1];

    if (requestCount > 3) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    next();
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    res.status(500).json(error);
    createLog('critical', req, res, error);
    return;
  }
};
