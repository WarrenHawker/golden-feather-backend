import cors from 'cors';
import express, { json, Request, Response } from 'express';
import rateLimiter from './middleware/rate-limiter.middleware';
import { redisStore } from './lib/redis/client.redis';
import ErrorReturn from './types/error-return';
import { compressionMiddleware } from './middleware/compression.middleware';
import { createSessionConfig } from './middleware/session.middleware';
import { corsOptions } from './middleware/cors.middleware';
import routes from './routes';

export const app = express();

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(rateLimiter(100, 60 * 1000)); //100 requests per minute for general routes
app.use(compressionMiddleware);
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(createSessionConfig(redisStore));

app.use(routes);

//catch-all if the requested route or method doesn't exist.
app.use((req: Request, res: Response) => {
  const error: ErrorReturn = {
    code: 405,
    message: `There is no ${req.method} endpoint at ${req.originalUrl}`,
  };
  return res.status(405).json(error);
});
