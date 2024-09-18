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
import validateFields, {
  RequiredField,
} from '../../middleware/validate-fields.middleware';
import express from 'express';
export const router = express.Router();

const createFields: RequiredField[] = [
  {
    name: 'name',
    type: 'string',
    optional: false,
    paramType: 'body',
  },
  {
    name: 'description',
    type: 'string',
    optional: true,
    paramType: 'body',
  },
];

const updateFields: RequiredField[] = [
  {
    name: 'name',
    type: 'string',
    optional: true,
    paramType: 'body',
  },
  {
    name: 'description',
    type: 'string',
    optional: true,
    paramType: 'body',
  },
];

router.get('/creator', getCreatorTags);
router.get('/guild', getGuildTags);

//creating, updating or deleting tags can only be done by active admins
router.use(checkSession());
router.use(checkRole('admin'));
router.use(checkStatus('active'));

router.post('/creator', validateFields(createFields), createCreatorTag);
router.post('/guild', validateFields(createFields), createGuildTag);

router.patch('/creator/:id', validateFields(updateFields), updateCreatorTag);
router.patch('/guild/:id', validateFields(updateFields), updateGuildTag);

router.delete('/creator/:id', deleteCreatorTag);
router.delete('/guild/:id', deleteGuildTag);
