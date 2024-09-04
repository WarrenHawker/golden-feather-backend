import express from 'express';
import { checkRole, checkStatus } from '../middleware/require-auth.middleware';
import { getUsers } from '../controllers/user-controllers/get-users.controller';
import { getUserByEmail } from '../controllers/user-controllers/get-user-by-email.controller';

export const router = express.Router();

router.get('/', checkRole('admin'), checkStatus('active'), getUsers);
router.get(
  '/:email',
  checkRole('admin'),
  checkStatus('active'),
  getUserByEmail
);
