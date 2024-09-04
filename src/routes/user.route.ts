import express from 'express';
import { checkRole, checkStatus } from '../middleware/require-auth.middleware';
import { getUsers } from '../controllers/user-controllers/get-users.controller';
import { getUserById } from '../controllers/user-controllers/get-user-by-id.controller';

export const router = express.Router();

router.get('/', checkRole('admin'), checkStatus('active'), getUsers);
router.get('/:id', checkRole('admin'), checkStatus('active'), getUserById);
