import deleteUser from '../../controllers/user-controllers/delete-user.controller';
import getUserById from '../../controllers/user-controllers/get-user-by-id.controller';
import getUsers from '../../controllers/user-controllers/get-users.controller';
import updateUser from '../../controllers/user-controllers/update-user.controller';
import {
  checkRole,
  checkSession,
  checkStatus,
} from '../../middleware/require-auth.middleware';
import validateFields, {
  RequiredField,
} from '../../middleware/validate-fields.middleware';
import express from 'express';
export const router = express.Router();

//TODO fill in required fields
const getFields: RequiredField[] = [];

const updateFields: RequiredField[] = [
  {
    name: 'username',
    type: 'string',
    optional: true,
    paramType: 'body',
  },
  {
    name: 'email',
    type: 'email',
    optional: true,
    paramType: 'body',
  },
  {
    name: 'password',
    type: 'password',
    optional: true,
    paramType: 'body',
  },
  {
    name: 'role',
    type: 'user role',
    optional: true,
    paramType: 'body',
  },
  {
    name: 'status',
    type: 'user status',
    optional: true,
    paramType: 'body',
  },
  {
    name: 'guildId',
    type: 'id',
    optional: true,
    paramType: 'body',
  },
  {
    name: 'creatorId',
    type: 'id',
    optional: true,
    paramType: 'body',
  },
];

router.patch('/:id', checkSession(), validateFields(updateFields), updateUser);

//fetching or deleting users can only be done by active admins
router.use(checkSession());
router.use(checkRole('admin'));
router.use(checkStatus('active'));

router.get('/', validateFields(getFields), getUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);
