import express from 'express';
import { authenticate } from '../middleware/require-auth.middleware';
import { createCreator } from '../controllers/creator-controllers/create-creator.controller';
import { deleteCreator } from '../controllers/creator-controllers/delete-creator.controller';
import { updateCreator } from '../controllers/creator-controllers/update-creator.controller';
import { getCreators } from '../controllers/creator-controllers/get-creators.controller';
import { getCreatorBySlug } from '../controllers/creator-controllers/get-creator-by-slug.controller';

export const router = express.Router();

router.get('/', getCreators);
router.post('/', createCreator);
router.patch('/:id', updateCreator);
router.get('/:slug', getCreatorBySlug);

/*
all routes that come after this middleware are protected.
can only be access if the user is logged in and has the correct role and status.
*/
router.use(authenticate);

router.delete('/', deleteCreator);
