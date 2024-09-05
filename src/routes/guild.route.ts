import express from 'express';
import createGuild from '../controllers/guild-controllers/create-guild.controller';
import deleteGuild from '../controllers/guild-controllers/delete-guild.controller';
import getGuildBySlug from '../controllers/guild-controllers/get-guild-by-slug.controller';
import getGuilds from '../controllers/guild-controllers/get-guilds.controller';
import updateGuild from '../controllers/guild-controllers/update-guild.controller';
import { checkRole, checkStatus } from '../middleware/require-auth.middleware';
import validateFields from '../middleware/validate-fields.middleware';

export const router = express.Router();

const createFields = [
  'name',
  'description',
  'status',
  'language',
  'tags',
  'region',
  'socials',
];

router.get('/', getGuilds);
router.post(
  '/',
  checkRole('admin'),
  checkStatus('active'),
  validateFields(createFields),
  createGuild
);
router.patch('/:id', updateGuild);
router.get('/:slug', getGuildBySlug);
router.delete('/:id', checkRole('admin'), checkStatus('active'), deleteGuild);

//TODO allow only admins or the linked user to update guild
