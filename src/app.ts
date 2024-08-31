import cors from 'cors';
import express, { Request, Response } from 'express';
import { router as authRoutes } from './routes/auth.route';
import { router as sessionRoutes } from './routes/session.route';
import { router as logRoutes } from './routes/log.route';
import { router as creatorRoutes } from './routes/creator.route';
import { router as guildRoutes } from './routes/guild.route';
import { router as videoRoutes } from './routes/video.route';
import { router as tagRoutes } from './routes/tag.route';
import session from './services/session.service';
import { rateLimiter } from './middleware/rate-limiter.middleware';
import compression from 'compression';

export const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://incredible-pithivier-e5551f.netlify.app/',
  'https://incredible-pithivier-e5551f.netlify.app',
  'https://66c358ae210d060c49154acc--incredible-pithivier-e5551f.netlify.app/',
  'https://66c358ae210d060c49154acc--incredible-pithivier-e5551f.netlify.app',
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
app.use(session);
// app.use(rateLimiter);

const apiBasePath = '/api/v1';

app.use(`${apiBasePath}/auth`, authRoutes);
app.use(`${apiBasePath}/session`, sessionRoutes);
app.use(`${apiBasePath}/log`, logRoutes);
app.use(`${apiBasePath}/guild`, guildRoutes);
app.use(`${apiBasePath}/creator`, creatorRoutes);
app.use(`${apiBasePath}/video`, videoRoutes);
app.use(`${apiBasePath}/tag`, tagRoutes);
