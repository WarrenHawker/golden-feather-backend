// /*
//   "authentication" routes

//   declares the endpoints related to user authentication.
// */

// //import packages
// import express from 'express';
// import { signInUser } from '../controllers/auth-controllers/signin.controller';

// import { authenticate } from '../middleware/require-auth.middleware';

// //initialise express router
// export const router = express.Router();

// //sign in route
// router.post('/signin', signInUser);

// /*
//   all routes that come after this middleware are protected.
//   can only be access if the user is logged in and has the correct role and status.
// */
// router.use(authenticate);
