/*
  "authentication" routes

  declares the endpoints related to user authentication.
*/

//import packages
import express from 'express';

import { authenticate } from '../middleware/require-auth.middleware';
import { signInUser } from '../controllers/auth-controllers/signin.controller';
import { signUpUser } from '../controllers/auth-controllers/signup.controller';

//initialise express router
export const router = express.Router();

//sign in route
router.post('/signin', signInUser);

/*
all routes that come after this middleware are protected.
can only be access if the user is logged in and has the correct role and status.
*/
router.use(authenticate);
router.post('/signup', signUpUser);
