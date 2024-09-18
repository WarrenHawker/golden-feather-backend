import {
  checkRole,
  checkSession,
  checkStatus,
} from '../../middleware/require-auth.middleware';
import getForms from '../../controllers/form-controllers/get-forms.controller';
import validateFields, {
  RequiredField,
} from '../../middleware/validate-fields.middleware';
import receiveContactForm from '../../controllers/form-controllers/recieve-contact-form.controller';
import rateLimiter from '../../middleware/rate-limiter.middleware';
import verifyRecaptcha from '../../middleware/verify-recaptcha.middleware';
import express from 'express';
export const router = express.Router();

//sending a contact form is rate limited to 3 requests per minute
const contactFormFields: RequiredField[] = [
  {
    name: 'name',
    type: 'string',
    optional: false,
    paramType: 'body',
  },
  {
    name: 'email',
    type: 'email',
    optional: false,
    paramType: 'body',
  },
  {
    name: 'message',
    type: 'string',
    optional: false,
    paramType: 'body',
  },
];

//TODO fill in required fields
const getFields: RequiredField[] = [];

router.post(
  '/contact',
  validateFields(contactFormFields),
  verifyRecaptcha,
  rateLimiter(3, 60, 'contact-form'),
  receiveContactForm
);

//all form GET routes require admin access
router.use(checkSession());
router.use(checkRole('admin'));
router.use(checkStatus('active'));

router.get('/', validateFields(getFields), getForms);
