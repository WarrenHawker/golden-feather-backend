import express from 'express';

import {
  checkRole,
  checkSession,
  checkStatus,
} from '../../middleware/require-auth.middleware';
import getForms from '../../controllers/form-controllers/get-forms.controller';
import validateFields from '../../middleware/validate-fields.middleware';
import receiveContactForm from '../../controllers/form-controllers/recieve-contact-form.controller';

export const router = express.Router();

const contactFormFields = ['name', 'email', 'message'];
router.post('/contact', validateFields(contactFormFields), receiveContactForm);

//all form GET routes require admin access
router.use(checkSession());
router.use(checkRole('admin'));
router.use(checkStatus('active'));

router.get('/', getForms);
