import express from 'express';
import createGuild from '../../controllers/guild-controllers/create-guild.controller';
import deleteGuild from '../../controllers/guild-controllers/delete-guild.controller';
import getGuildBySlug from '../../controllers/guild-controllers/get-guild-by-slug.controller';
import getGuilds from '../../controllers/guild-controllers/get-guilds.controller';
import updateGuild from '../../controllers/guild-controllers/update-guild.controller';
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
    paramType: 'body',
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
  {
    name: 'region',
    type: 'string array',
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
    name: 'guild_leader',
    type: 'string',
    optional: true,
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
    name: 'regions',
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
    name: 'userID',
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
    name: 'guild_leader',
    type: 'string',
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
    name: 'regions',
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
    name: 'userID',
    type: 'id',
    optional: true,
    paramType: 'body',
  },
];

router.get('/', validateFields(getFields), getGuilds);

router.get('/:slug', getGuildBySlug);

router.post(
  '/',
  checkSession(),
  checkRole('admin'),
  checkStatus('active'),
  validateFields(createFields),
  createGuild
);

router.patch('/:id', checkSession(), validateFields(updateFields), updateGuild);

router.delete(
  '/:id',
  checkSession(),
  checkRole('admin'),
  checkStatus('active'),
  deleteGuild
);
