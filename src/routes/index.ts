import { router as authRoutes } from './route-files/auth.route';
import { router as sessionRoutes } from './route-files/session.route';
import { router as logRoutes } from './route-files/log.route';
import { router as creatorRoutes } from './route-files/creator.route';
import { router as guildRoutes } from './route-files/guild.route';
import { router as videoRoutes } from './route-files/video.route';
import { router as tagRoutes } from './route-files/tag.route';
import { router as userRoutes } from './route-files/user.route';
import { router as languageRoutes } from './route-files/language.route';
import { Router } from 'express';

export const router = Router();

const apiBasePath = '/api/v1';

router.use(`${apiBasePath}/auth`, authRoutes);
router.use(`${apiBasePath}/session`, sessionRoutes);
router.use(`${apiBasePath}/log`, logRoutes);
router.use(`${apiBasePath}/guild`, guildRoutes);
router.use(`${apiBasePath}/creator`, creatorRoutes);
router.use(`${apiBasePath}/video`, videoRoutes);
router.use(`${apiBasePath}/tag`, tagRoutes);
router.use(`${apiBasePath}/user`, userRoutes);
router.use(`${apiBasePath}/language`, languageRoutes);
