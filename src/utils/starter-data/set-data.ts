import { createCreatorDB } from '../../services/db-services/creator-db-services/create-creator.service';
import createGuildDB from '../../services/db-services/guild-db-services/create-guild.service';
import { creators } from './starting-creators';
import { guilds } from './starting-guilds';

export const setStarterCreators = async () => {
  try {
    for (const creator of creators) {
      await createCreatorDB(creator);
    }
  } catch (error) {
    throw error;
  }
};

export const setStarterGuilds = async () => {
  try {
    for (const guild of guilds) {
      await createGuildDB(guild);
    }
  } catch (error) {
    throw error;
  }
};
