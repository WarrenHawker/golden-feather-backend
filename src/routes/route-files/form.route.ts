import express from 'express';

import {
  checkRole,
  checkSession,
  checkStatus,
} from '../../middleware/require-auth.middleware';
import getForms from '../../controllers/form-controllers/get-forms.controller';

export const router = express.Router();

//all form-related routes require admin access
router.use(checkSession());
router.use(checkRole('admin'));
router.use(checkStatus('active'));

router.get('/', getForms);
