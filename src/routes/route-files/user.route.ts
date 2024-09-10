import express from 'express';
import deleteUser from '../../controllers/user-controllers/delete-user.controller';
import getUserById from '../../controllers/user-controllers/get-user-by-id.controller';
import getUsers from '../../controllers/user-controllers/get-users.controller';
import updateUser from '../../controllers/user-controllers/update-user.controller';
import {
  checkRole,
  checkSession,
  checkStatus,
} from '../../middleware/require-auth.middleware';

export const router = express.Router();
router.patch('/:id', updateUser);

//fetching or deleting users can only be done by active admins
router.use(checkSession());
router.use(checkRole('admin'));
router.use(checkStatus('active'));

router.get('/', getUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);
