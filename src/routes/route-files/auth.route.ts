import express from 'express';
import signInUser from '../../controllers/auth-controllers/signin.controller';
import signoutUser from '../../controllers/auth-controllers/signout.controller';
import signUpUser from '../../controllers/auth-controllers/signup.controller';
import {
  checkRole,
  checkSession,
  checkStatus,
} from '../../middleware/require-auth.middleware';
import validateFields, {
  RequiredField,
} from '../../middleware/validate-fields.middleware';
import requestPassword from '../../controllers/auth-controllers/request-password.controller';
import validateReset from '../../controllers/auth-controllers/validate-reset.controller';
import getUserProfile from '../../controllers/auth-controllers/get-user-profile.controller';
import rateLimiter from '../../middleware/rate-limiter.middleware';
import verifyRecaptcha from '../../middleware/verify-recaptcha.middleware';
import responseHandler from '../../middleware/response-handler.middleware';

export const router = express.Router();

const signinFields: RequiredField[] = [
  {
    name: 'email',
    type: 'email',
    optional: false,
    paramType: 'body',
  },
  {
    name: 'password',
    type: 'password',
    optional: false,
    paramType: 'body',
  },
];

const signupFields: RequiredField[] = [
  {
    name: 'username',
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
    name: 'password',
    type: 'password',
    optional: false,
    paramType: 'body',
  },
  {
    name: 'repeatPassword',
    type: 'password',
    optional: false,
    paramType: 'body',
  },
];

const requestFields: RequiredField[] = [
  {
    name: 'email',
    type: 'email',
    optional: false,
    paramType: 'body',
  },
];

const resetFields: RequiredField[] = [
  {
    name: 'email',
    type: 'email',
    optional: false,
    paramType: 'body',
  },
  {
    name: 'password',
    type: 'password',
    optional: false,
    paramType: 'body',
  },
  {
    name: 'repeatPassword',
    type: 'password',
    optional: false,
    paramType: 'body',
  },
  {
    name: 'token',
    type: 'token',
    optional: false,
    paramType: 'body',
  },
];

/*
  the "profile" routes searches for a valid session then retrieves 
  the user profile based on the signed in session
*/
router.get('/profile', checkSession(), getUserProfile);

/* 
  the "admin" route searches for a valid session with active admin role, 
  used to access the admin dashboard
*/
router.get(
  '/admin',
  checkSession(),
  checkRole('admin'),
  checkStatus('active'),
  (req, res) => {
    responseHandler(req, res, 200);
  }
);

router.post(
  '/signin',
  rateLimiter(3, 60, 'signin'),
  validateFields(signinFields),
  verifyRecaptcha,
  signInUser
);

//signup endpoint temporarily locked behind admin for now
router.post(
  '/signup',
  checkSession(),
  checkRole('admin'),
  checkStatus('active'),
  rateLimiter(3, 60, 'signup'),
  validateFields(signupFields),
  verifyRecaptcha,
  signUpUser
);

router.post('/signout', signoutUser);

router.post(
  '/password-reset/request',
  rateLimiter(3, 60 * 1000, 'password-reset/request'),
  validateFields(requestFields),
  verifyRecaptcha,
  requestPassword
);

router.post(
  '/password-reset/validate',
  rateLimiter(3, 60 * 1000, 'password-reset/validate'),
  validateFields(resetFields),
  verifyRecaptcha,
  validateReset
);
