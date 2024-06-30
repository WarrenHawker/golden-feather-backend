/*
  "guild" routes

  declares the endpoints for guild CRUD operations.   
*/

//import packages
import express from 'express';
import { authenticate } from '../middleware/require-auth.middleware';
import { deleteGuild } from '../controllers/guild-controllers/delete-guild.controller';
import { createGuild } from '../controllers/guild-controllers/create-guild.controller';
import { updateGuild } from '../controllers/guild-controllers/update-guild.controller';
import { getGuilds } from '../controllers/guild-controllers/get-guilds.controller';

//initialise express router
export const router = express.Router();

router.get('/', getGuilds);
/*
  all routes that come after this middleware are protected.
  can only be access if the user is logged in and has the correct role and status.
*/
router.use(authenticate);

router.post('/', createGuild);
router.patch('/:id', updateGuild);
router.delete('/:id', deleteGuild);
