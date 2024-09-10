import express from 'express';
import getLogs from '../../controllers/log-controllers/get-logs.controller';
import {
  checkRole,
  checkSession,
  checkStatus,
} from '../../middleware/require-auth.middleware';

export const router = express.Router();

//all log-related routes require admin access
router.use(checkSession());
router.use(checkRole('admin'));
router.use(checkStatus('active'));

router.get('/', getLogs);
