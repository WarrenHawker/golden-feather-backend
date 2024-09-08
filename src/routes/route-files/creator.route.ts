import express from 'express';
import createCreator from '../../controllers/creator-controllers/create-creator.controller';
import deleteCreator from '../../controllers/creator-controllers/delete-creator.controller';
import getCreatorBySlug from '../../controllers/creator-controllers/get-creator-by-slug.controller';
import getCreators from '../../controllers/creator-controllers/get-creators.controller';
import updateCreator from '../../controllers/creator-controllers/update-creator.controller';
import {
  checkRole,
  checkStatus,
} from '../../middleware/require-auth.middleware';
import validateFields from '../../middleware/validate-fields.middleware';
import csrf from 'csurf';

export const router = express.Router();

const createFields = [
  'name',
  'description',
  'videoUrl',
  'socials',
  'tags',
  'language',
  'status',
];

router.get('/', getCreators);
router.get('/:slug', getCreatorBySlug);

// CSRF protection is applied to the below routes
router.use(csrf({ cookie: true }));

router.post(
  '/',
  checkRole('admin'),
  checkStatus('active'),
  validateFields(createFields),
  createCreator
);
router.patch('/:id', updateCreator);
router.delete('/', checkRole('admin'), checkStatus('active'), deleteCreator);
