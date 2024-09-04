import cors, { CorsOptions } from 'cors';
import express, { json, Request, Response } from 'express';
import { router as authRoutes } from './routes/auth.route';
import { router as sessionRoutes } from './routes/session.route';
import { router as logRoutes } from './routes/log.route';
import { router as creatorRoutes } from './routes/creator.route';
import { router as guildRoutes } from './routes/guild.route';
import { router as videoRoutes } from './routes/video.route';
import { router as tagRoutes } from './routes/tag.route';
import { rateLimiter } from './middleware/rate-limiter.middleware';
import compression from 'compression';
import session from 'express-session';
import { redisStore } from './lib/redis/client.redis';
import { ErrorReturn } from './types/error-return';

export const app = express();

app.use(
  compression({
    filter: shouldCompress,
    threshold: 0, // Compress all responses
    level: 6, // Default compression level for Brotli is 4, but you can adjust it
  })
);

function shouldCompress(req: Request, res: Response) {
  if (req.headers['x-no-compression']) {
    // Don't compress responses with this request header
    return false;
  }

  // Fallback to the standard filter function
  return compression.filter(req, res);
}

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
app.use(cors(corsOptions));

app.set('trust proxy', 1);
app.use(json());

app.use(
  session({
    store: redisStore,
    secret: process.env.SECRET || '',
    saveUninitialized: false,
    resave: false,
    name: 'sessionId',
    cookie: {
      secure: process.env.NODE_ENV == 'production' ? true : 'auto',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'lax',
    },
  })
);
// app.use(rateLimiter);

const apiBasePath = '/api/v1';

app.use(`${apiBasePath}/auth`, authRoutes);
app.use(`${apiBasePath}/session`, sessionRoutes);
app.use(`${apiBasePath}/log`, logRoutes);
app.use(`${apiBasePath}/guild`, guildRoutes);
app.use(`${apiBasePath}/creator`, creatorRoutes);
app.use(`${apiBasePath}/video`, videoRoutes);
app.use(`${apiBasePath}/tag`, tagRoutes);

//catch-all if the requested route or method doesn't exist.
app.use((req: Request, res: Response) => {
  const error: ErrorReturn = {
    code: 405,
    message: `There is no ${req.method} endpoint at ${req.originalUrl}`,
  };
  return res.status(405).json(error);
});
