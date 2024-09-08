import express from 'express';
import deleteSession from '../../controllers/session-controllers/delete-session.controller';
import getSessions from '../../controllers/session-controllers/get-sessions.controller';
import {
  checkRole,
  checkStatus,
} from '../../middleware/require-auth.middleware';
import csrf from 'csurf';

export const router = express.Router();

router.get('/', checkRole('admin'), checkStatus('active'), getSessions);

// CSRF protection is applied to the below routes
router.use(csrf({ cookie: true }));

router.delete('/:id', checkRole('admin'), checkStatus('active'), deleteSession);
