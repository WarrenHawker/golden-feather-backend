import cors from 'cors';
import express from 'express';
import { router as authRoutes } from './routes/auth.route';
import { router as sessionRoutes } from './routes/session.route';
import { router as logRoutes } from './routes/log.route';
import { router as creatorRoutes } from './routes/creator.route';
import { router as guildRoutes } from './routes/guild.route';
import session from './services/session.service';
import { rateLimiter } from './middleware/rate-limiter.middleware';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(session);
app.use(rateLimiter);

const apiBasePath = '/api/v1';

app.use(`${apiBasePath}/auth`, authRoutes);
app.use(`${apiBasePath}/session`, sessionRoutes);
app.use(`${apiBasePath}/log`, logRoutes);
app.use(`${apiBasePath}/guild`, guildRoutes);
app.use(`${apiBasePath}/creator`, creatorRoutes);
