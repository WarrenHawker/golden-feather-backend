import express from 'express';
import { createCreator } from '../controllers/creator-controllers/create-creator.controller';
import { deleteCreator } from '../controllers/creator-controllers/delete-creator.controller';
import { updateCreator } from '../controllers/creator-controllers/update-creator.controller';
import { getCreators } from '../controllers/creator-controllers/get-creators.controller';
import { getCreatorBySlug } from '../controllers/creator-controllers/get-creator-by-slug.controller';
import { checkRole, checkStatus } from '../middleware/require-auth.middleware';

export const router = express.Router();

router.get('/', getCreators);
router.post('/', checkRole('admin'), checkStatus('active'), createCreator);
router.patch('/:id', updateCreator);
router.get('/:slug', getCreatorBySlug);
router.delete('/', checkRole('admin'), checkStatus('active'), deleteCreator);
//TODO fill out controller functions for updating and deleting creators
