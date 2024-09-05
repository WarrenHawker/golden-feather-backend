import express from 'express';
import { checkRole, checkStatus } from '../middleware/require-auth.middleware';
import getUsers from '../controllers/user-controllers/get-users.controller';
import getUserById from '../controllers/user-controllers/get-user-by-id.controller';
import updateUser from '../controllers/user-controllers/update-user.controller';
import deleteUser from '../controllers/user-controllers/delete-user.controller';

export const router = express.Router();

router.get('/', checkRole('admin'), checkStatus('active'), getUsers);
router.get('/:id', checkRole('admin'), checkStatus('active'), getUserById);
router.patch('/:id', checkRole('admin'), checkStatus('active'), updateUser);
router.delete('/:id', checkRole('admin'), checkStatus('active'), deleteUser);

//TODO allow only admins or the user to update user
