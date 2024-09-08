import express from 'express';
import deleteUser from '../../controllers/user-controllers/delete-user.controller';
import getUserById from '../../controllers/user-controllers/get-user-by-id.controller';
import getUsers from '../../controllers/user-controllers/get-users.controller';
import updateUser from '../../controllers/user-controllers/update-user.controller';
import {
  checkRole,
  checkStatus,
} from '../../middleware/require-auth.middleware';
import csrf from 'csurf';

export const router = express.Router();

router.get('/', checkRole('admin'), checkStatus('active'), getUsers);
router.get('/:id', checkRole('admin'), checkStatus('active'), getUserById);

// CSRF protection is applied to the below routes
router.use(csrf({ cookie: true }));

router.patch('/:id', updateUser);
router.delete('/:id', checkRole('admin'), checkStatus('active'), deleteUser);