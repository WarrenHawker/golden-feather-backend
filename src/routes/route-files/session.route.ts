import deleteSession from '../../controllers/session-controllers/delete-session.controller';
import getSessions from '../../controllers/session-controllers/get-sessions.controller';
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

//all session-related routes require admin access
router.use(checkSession());
router.use(checkRole('admin'));
router.use(checkStatus('active'));

router.get('/', validateFields(getFields), getSessions);
router.delete('/:id', deleteSession);
