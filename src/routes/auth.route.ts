import express from 'express';
import signInUser from '../controllers/auth-controllers/signin.controller';
import signoutUser from '../controllers/auth-controllers/signout.controller';
import signUpUser from '../controllers/auth-controllers/signup.controller';
import { checkRole, checkStatus } from '../middleware/require-auth.middleware';
import validateFields from '../middleware/validate-fields.middleware';
import requestPassword from '../controllers/auth-controllers/request-password.controller';
import validateReset from '../controllers/auth-controllers/validate-reset.controller';

export const router = express.Router();

const signinFields = ['email', 'password'];
const signupFields = ['name', 'email', 'password', 'repeatPassword'];
const resetFields = ['email', 'password', 'repeatPassword', 'token'];

router.post('/signin', validateFields(signinFields), signInUser);
router.post('/signup', validateFields(signupFields), signUpUser);
router.post('/signout', signoutUser);
router.post(
  '/password-reset/request',
  validateFields(['email']),
  requestPassword
);
router.post(
  '/password-reset/validate',
  validateFields(resetFields),
  validateReset
);

//the "admin" route searches for a valid session with admin role - used to access the admin dashboard
router.get('/admin', checkRole('admin'), checkStatus('active'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin area!' });
});
