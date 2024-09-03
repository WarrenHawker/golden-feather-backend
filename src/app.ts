import cors from 'cors';
import express, { Request, Response } from 'express';
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

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://incredible-pithivier-e5551f.netlify.app/',
  'https://incredible-pithivier-e5551f.netlify.app',
  'https://66c358ae210d060c49154acc--incredible-pithivier-e5551f.netlify.app/',
  'https://66c358ae210d060c49154acc--incredible-pithivier-e5551f.netlify.app',
  'https://golden-feather-frontend-nextjs-drab.vercel.app/',
  'https://golden-feather-frontend-nextjs-warrenhawkers-projects.vercel.app/',
  'https://golden-feather-frontend-nextj-git-6b33bb-warrenhawkers-projects.vercel.app/',
];

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

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        // Allow requests with no origin (like mobile apps or curl requests)
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    store: redisStore,
    secret: process.env.SECRET || '',
    saveUninitialized: false,
    resave: false,
    name: 'sessionId',
    cookie: {
      secure: false, //if true, only transmit cookie over https - true in production
      httpOnly: true, //if true, prevents client side JS from reading cookie
      maxAge: 1000 * 60 * 60, //session lasts 1 hour
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
app.use((req, res, next) => {
  const error: ErrorReturn = {
    code: 404,
    message: `There is no ${req.method} endpoint at ${req.originalUrl}`,
  };
  return res.status(404).json(error);
});
