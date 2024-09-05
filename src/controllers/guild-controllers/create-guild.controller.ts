import { Request, Response } from 'express';
import { escape } from 'validator';
import createLog from '../../services/logger.service';
import ErrorReturn from '../../types/error-return';
import {
  isContentStatus,
  isValidCuid,
} from '../../utils/functions/validate-input.function';
import { GuildCreationData } from '../../types/guild';
import sanitiseArray from '../../utils/functions/sanitise-array.function';
import sanitiseObject from '../../utils/functions/sanitise-socials.function';
import createGuildDB from '../../services/guild-db-services/create-guild.service';

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
    res.status(404).json(error);
    createLog('error', req, res, error);
    return;
  }

  if (!isValidCuid(userId)) {
    const error: ErrorReturn = {
      code: 400,
      message: 'invalid userId',
      params: ['userId'],
    };
    res.status(404).json(error);
    createLog('error', req, res, error);
    return;
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
    createLog('critical', req, res, error);
    return res.status(500).json(error);
  }
};

export default createGuild;
