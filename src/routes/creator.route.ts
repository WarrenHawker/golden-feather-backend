/*
  "content creator" routes

  declares the endpoints for content creator CRUD operations.   
*/

//import packages
import express from 'express';

import { authenticate } from '../middleware/require-auth.middleware';
import { createCreator } from '../controllers/content-creator-controllers/create-creator.controller';
import { deleteCreator } from '../controllers/content-creator-controllers/delete-creator.controller';
import { updateCreator } from '../controllers/content-creator-controllers/update-creator.controller';
import { getCreators } from '../controllers/content-creator-controllers/get-creator.controller';

//initialise express router
export const router = express.Router();

router.get('/', getCreators);
router.post('/', createCreator);
router.patch('/:id', updateCreator);

/*
all routes that come after this middleware are protected.
can only be access if the user is logged in and has the correct role and status.
*/
router.use(authenticate);

router.delete('/', deleteCreator);
