import express from 'express';
import {
  checkSession,
  checkRole,
  checkStatus,
} from '../../middleware/require-auth.middleware';
import createCreatorTag from '../../controllers/tag-controllers/creator-tag-controllers/create-creator-tag.controller';
import updateCreatorTag from '../../controllers/tag-controllers/creator-tag-controllers/update-creator-tag.controller';
import deleteCreatorTag from '../../controllers/tag-controllers/creator-tag-controllers/delete-creator-tag.controller';
import getCreatorTags from '../../controllers/tag-controllers/creator-tag-controllers/get-creator-tags.controller';
import createGuildTag from '../../controllers/tag-controllers/guild-tag-controllers/create-guild-tag.controller';
import deleteGuildTag from '../../controllers/tag-controllers/guild-tag-controllers/delete-guild-tag.controller';
import getGuildTags from '../../controllers/tag-controllers/guild-tag-controllers/get-guild-tags.controller';
import updateGuildTag from '../../controllers/tag-controllers/guild-tag-controllers/update-guild-tag.controller';
import validateFields from '../../middleware/validate-fields.middleware';

export const router = express.Router();

router.get('/creator', getCreatorTags);
router.get('/guild', getGuildTags);

//creating, updating or deleting tags can only be done by active admins
router.use(checkSession());
router.use(checkRole('admin'));
router.use(checkStatus('active'));

router.post(
  '/creator',
  validateFields(['name', 'description']),
  createCreatorTag
);
router.post('/guild', validateFields(['name', 'description']), createGuildTag);

router.patch('/creator/:id', updateCreatorTag);
router.patch('/guild/:id', updateGuildTag);

router.delete('/creator/:id', deleteCreatorTag);
router.delete('/guild/:id', deleteGuildTag);
