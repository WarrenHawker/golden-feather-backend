import cors from 'cors';
import express, { json, NextFunction, Request, Response } from 'express';
import { redisStore } from './lib/redis/client.redis';
import { compressionMiddleware } from './middleware/compression.middleware';
import { createSessionConfig } from './middleware/session.middleware';
import { corsOptions } from './middleware/cors.middleware';
import cookieParser from 'cookie-parser';
import { measureResponseTime } from './middleware/response-time.middleware';
import rateLimiter from './middleware/rate-limiter.middleware';
import { router } from './routes';
import { CustomError } from './types/custom-error';
import responseHandler from './middleware/response-handler.middleware';

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

app.use(router);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  return responseHandler(req, res, err.statusCode || 500, null, err);
});

//catch-all if the requested route or method doesn't exist.
app.use((req: Request, res: Response, next: NextFunction) => {
  return next(
    new CustomError(
      'The requested resource could not be found.',
      405,
      `There is no ${req.method} endpoint at ${req.originalUrl}`
    )
  );
});
