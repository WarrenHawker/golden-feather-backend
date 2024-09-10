import cors from 'cors';
import express, { json, Request, Response } from 'express';
import { redisStore } from './lib/redis/client.redis';
import { compressionMiddleware } from './middleware/compression.middleware';
import { createSessionConfig } from './middleware/session.middleware';
import { corsOptions } from './middleware/cors.middleware';
import cookieParser from 'cookie-parser';
import { measureResponseTime } from './middleware/response-time.middleware';
import rateLimiter from './middleware/rate-limiter.middleware';
import { router } from './routes';
import { ErrorReturn } from './types/error-return';
import logMiddleware from './middleware/logger.middleware';

export const app = express();

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(rateLimiter());
app.use(createSessionConfig(redisStore));
app.use(compressionMiddleware);
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(measureResponseTime);
app.use(logMiddleware);

app.use(router);

//catch-all if the requested route or method doesn't exist.
app.use((req: Request, res: Response) => {
  const error: ErrorReturn = {
    code: 405,
    message: `There is no ${req.method} endpoint at ${req.originalUrl}`,
  };
  return res.status(405).json(error);
});
