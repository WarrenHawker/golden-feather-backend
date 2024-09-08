import { Request, Response } from 'express';
import { escape } from 'validator';
import {
  isContentStatus,
  isValidCuid,
} from '../../utils/functions/validate-input.function';
import { GuildCreationData } from '../../types/guild';
import sanitiseArray from '../../utils/functions/sanitise-array.function';
import sanitiseObject from '../../utils/functions/sanitise-socials.function';
import createGuildDB from '../../services/db-services/guild-db-services/create-guild.service';
import { ErrorReturn } from '../../types/error-return';

const createGuild = async (req: Request, res: Response) => {
  let {
    name,
    description,
    guild_leader,
    status,
    language,
    tags,
    region,
    userId,
    socials,
  } = req.body;

  if (!isContentStatus(status)) {
    const error: ErrorReturn = {
      code: 400,
      message: 'invalid content status',
      params: ['status'],
    };
    return res.status(404).json(error);
  }

  if (!isValidCuid(userId)) {
    const error: ErrorReturn = {
      code: 400,
      message: 'invalid userId',
      params: ['userId'],
    };
    return res.status(404).json(error);
  }

  const createData: GuildCreationData = {
    name: escape(name).trim(),
    description: escape(description).trim(),
    socials: sanitiseObject(socials),
    tags: sanitiseArray(tags),
    language: escape(language).trim(),
    status,
    userId,
    guild_leader: escape(guild_leader).trim(),
    region: escape(region).trim(),
  };

  try {
    const { newGuild, warningMessage } = await createGuildDB(createData);
    res.status(201).json({ creator: newGuild, warningMessage });
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    return res.status(500).json(error);
  }
};

export default createGuild;
