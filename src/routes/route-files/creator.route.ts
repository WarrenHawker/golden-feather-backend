import express from 'express';
import createCreator from '../../controllers/creator-controllers/create-creator.controller';
import deleteCreator from '../../controllers/creator-controllers/delete-creator.controller';
import getCreatorBySlug from '../../controllers/creator-controllers/get-creator-by-slug.controller';
import getCreators from '../../controllers/creator-controllers/get-creators.controller';
import updateCreator from '../../controllers/creator-controllers/update-creator.controller';
import {
  checkRole,
  checkSession,
  checkStatus,
} from '../../middleware/require-auth.middleware';
import validateFields, {
  RequiredField,
} from '../../middleware/validate-fields.middleware';

export const router = express.Router();

const getFields: RequiredField[] = [
  {
    name: 'page',
    type: 'number',
    optional: true,
    paramType: 'query',
  },
  {
    name: 'limit',
    type: 'number',
    optional: true,
    paramType: 'query',
  },
  {
    name: 'name',
    type: 'string',
    optional: true,
    paramType: 'query',
  },
  {
    name: 'lang',
    type: 'string array',
    optional: true,
    paramType: 'query',
  },
  {
    name: 'tag',
    type: 'string array',
    optional: true,
    paramType: 'query',
  },
  {
    name: 'admin',
    type: 'boolean',
    optional: true,
    paramType: 'query',
  },
];

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
    optional: false,
    paramType: 'body',
  },
  {
    name: 'excerpt',
    type: 'excerpt',
    optional: false,
    paramType: 'body',
  },
  {
    name: 'videoUrl',
    type: 'video url',
    optional: false,
    paramType: 'body',
  },
  {
    name: 'socials',
    type: 'socials',
    optional: false,
    paramType: 'body',
  },
  {
    name: 'tags',
    type: 'string array',
    optional: true,
    paramType: 'body',
  },
  {
    name: 'languages',
    type: 'string array',
    optional: true,
    paramType: 'body',
  },
  {
    name: 'status',
    type: 'content status',
    optional: false,
    paramType: 'body',
  },
  {
    name: 'userId',
    type: 'id',
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
  {
    name: 'excerpt',
    type: 'excerpt',
    optional: true,
    paramType: 'body',
  },
  {
    name: 'videoUrl',
    type: 'video url',
    optional: true,
    paramType: 'body',
  },
  {
    name: 'socials',
    type: 'socials',
    optional: true,
    paramType: 'body',
  },
  {
    name: 'tags',
    type: 'string array',
    optional: true,
    paramType: 'body',
  },
  {
    name: 'languages',
    type: 'string array',
    optional: true,
    paramType: 'body',
  },
  {
    name: 'status',
    type: 'content status',
    optional: true,
    paramType: 'body',
  },
  {
    name: 'userId',
    type: 'id',
    optional: true,
    paramType: 'body',
  },
];

router.get('/', validateFields(getFields), getCreators);

router.get('/:slug', getCreatorBySlug);

router.post(
  '/',
  checkSession(),
  checkRole('admin'),
  checkStatus('active'),
  validateFields(createFields),
  createCreator
);

router.patch(
  '/:id',
  checkSession(),
  validateFields(updateFields),
  updateCreator
);

router.delete(
  '/:id',
  checkSession(),
  checkRole('admin'),
  checkStatus('active'),
  deleteCreator
);
