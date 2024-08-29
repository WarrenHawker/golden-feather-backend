import express from 'express';
import { getLogs } from '../controllers/log-controllers/get-logs.controller';
import { authenticate } from '../middleware/require-auth.middleware';

export const router = express.Router();

router.use(authenticate);

router.get('/', getLogs);
