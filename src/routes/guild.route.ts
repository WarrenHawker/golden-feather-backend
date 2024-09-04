import express from 'express';
import { deleteGuild } from '../controllers/guild-controllers/delete-guild.controller';
import { createGuild } from '../controllers/guild-controllers/create-guild.controller';
import { updateGuild } from '../controllers/guild-controllers/update-guild.controller';
import { getGuilds } from '../controllers/guild-controllers/get-guilds.controller';
import { checkRole, checkStatus } from '../middleware/require-auth.middleware';
import { getGuildBySlug } from '../controllers/guild-controllers/get-guild-by-slug.controller';

export const router = express.Router();

router.get('/', getGuilds);
router.post('/', checkRole('admin'), checkStatus('active'), createGuild);
router.patch('/:id', updateGuild);
router.get('/:slug', getGuildBySlug);
router.delete('/:id', checkRole('admin'), checkStatus('active'), deleteGuild);

//TODO fill out controller functions for all guild routes
