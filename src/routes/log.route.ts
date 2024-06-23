/*
  "log" routes

  declares the endpoints related to fetching logs.   
*/

//import packages
import express from 'express';
import { getLogs } from '../controllers/log-controllers/get-logs.controller';
import { authenticate } from '../middleware/require-auth.middleware';

//initialise express router
export const router = express.Router();

router.use(authenticate);

//get logs route
router.get('/', getLogs);
