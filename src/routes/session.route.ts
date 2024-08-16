import express from 'express';
import { deleteSession } from '../controllers/session-controllers/delete-session.controller';
import { getSessions } from '../controllers/session-controllers/get-sessions.controller';
import { authenticate } from '../middleware/require-auth.middleware';

export const router = express.Router();

//all routes that come after this middleware are protected.
//can only be access if the user is logged in.
router.use(authenticate);

//get sessions route - Move to protected (admins only) in production
router.get('/', getSessions);
router.delete('/:id', deleteSession);
