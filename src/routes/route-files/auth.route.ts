import express from 'express';
import signInUser from '../../controllers/auth-controllers/signin.controller';
import signoutUser from '../../controllers/auth-controllers/signout.controller';
import signUpUser from '../../controllers/auth-controllers/signup.controller';
import {
  checkRole,
  checkSession,
  checkStatus,
} from '../../middleware/require-auth.middleware';
import validateFields from '../../middleware/validate-fields.middleware';
import requestPassword from '../../controllers/auth-controllers/request-password.controller';
import validateReset from '../../controllers/auth-controllers/validate-reset.controller';
import getUserProfile from '../../controllers/auth-controllers/get-user-profile.controller';
import rateLimiter from '../../middleware/rate-limiter.middleware';
import csrf from 'csurf';

export const router = express.Router();

const signinFields = ['email', 'password'];
const signupFields = ['name', 'email', 'password', 'repeatPassword'];
const resetFields = ['email', 'password', 'repeatPassword', 'token'];

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
    res.sendStatus(200);
  }
);

//signin and signup routes are rate limited to 3 requests per minute

router.post(
  '/signin',
  rateLimiter(3, 60, 'signin'),
  validateFields(signinFields),
  signInUser
);
router.post(
  '/signup',
  rateLimiter(3, 60, 'signup'),
  validateFields(signupFields),
  signUpUser
);
router.post('/signout', signoutUser);

// CSRF protection is applied to the below routes
router.use(csrf({ cookie: true }));

router.post(
  '/password-reset/request',
  rateLimiter(3, 60 * 1000, 'password-reset/request'),
  validateFields(['email']),
  requestPassword
);

router.post(
  '/password-reset/validate',
  rateLimiter(3, 60 * 1000, 'password-reset/validate'),
  validateFields(resetFields),
  validateReset
);
