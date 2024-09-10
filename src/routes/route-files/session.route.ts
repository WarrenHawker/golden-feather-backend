import express from 'express';
import deleteSession from '../../controllers/session-controllers/delete-session.controller';
import getSessions from '../../controllers/session-controllers/get-sessions.controller';
import {
  checkRole,
  checkSession,
  checkStatus,
} from '../../middleware/require-auth.middleware';

export const router = express.Router();

//all session-related routes require admin access
router.use(checkSession());
router.use(checkRole('admin'));
router.use(checkStatus('active'));

router.get('/', getSessions);
router.delete('/:id', deleteSession);
