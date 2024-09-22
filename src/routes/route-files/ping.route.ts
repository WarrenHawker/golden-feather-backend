import express from 'express';
import pingServer from '../../controllers/ping-controllers/ping.controller';
import checkServerHealth from '../../controllers/ping-controllers/health-check.controller';
import rateLimiter from '../../middleware/rate-limiter.middleware';
import authHeaderMiddleware from '../../middleware/auth-header.middleware';
export const router = express.Router();

router.get('/', rateLimiter(3, 60, 'ping'), pingServer);

router.get(
  '/health',
  rateLimiter(3, 60, 'health'),
  authHeaderMiddleware,
  checkServerHealth
);
