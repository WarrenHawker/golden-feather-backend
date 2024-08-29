import express from 'express';
import { signInUser } from '../controllers/auth-controllers/signin.controller';
import { signUpUser } from '../controllers/auth-controllers/signup.controller';
import { checkRole, checkStatus } from '../middleware/require-auth.middleware';
import { signoutUser } from '../controllers/auth-controllers/signout.controller';

export const router = express.Router();

router.post('/signin', signInUser);
router.post('/signup', signUpUser);
router.post('/signout', signoutUser);

//the "admin" route searches for a valid session with admin role - used to access the admin dashboard
router.get('/admin', checkRole('admin'), checkStatus('active'), (req, res) => {
  res.status(200);
});
