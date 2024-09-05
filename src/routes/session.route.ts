import express from 'express';
import deleteSession from '../controllers/session-controllers/delete-session.controller';
import getSessions from '../controllers/session-controllers/get-sessions.controller';
import { checkRole, checkStatus } from '../middleware/require-auth.middleware';

export const router = express.Router();

router.get('/', checkRole('admin'), checkStatus('active'), getSessions);
router.delete('/:id', checkRole('admin'), checkStatus('active'), deleteSession);
