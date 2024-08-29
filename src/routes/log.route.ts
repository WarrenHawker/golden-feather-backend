import express from 'express';
import { getLogs } from '../controllers/log-controllers/get-logs.controller';
import { checkRole, checkStatus } from '../middleware/require-auth.middleware';

export const router = express.Router();

router.get('/', checkRole('admin'), checkStatus('active'), getLogs);
