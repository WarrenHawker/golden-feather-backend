import { Request, Response } from 'express';
import { escape } from 'validator';
import {
  isContentStatus,
  isValidCuid,
  isValidVideoUrl,
} from '../../utils/functions/validate-input.function';
import { GuildCreationData } from '../../types/guild';
import sanitiseArray from '../../utils/functions/sanitise-array.function';
import sanitiseObject from '../../utils/functions/sanitise-socials.function';
import createGuildDB from '../../services/db-services/guild-db-services/create-guild.service';
import { ErrorReturn } from '../../types/error-return';
import trimExcerpt from '../../utils/functions/trim-excerpt.function';

const createGuild = async (req: Request, res: Response) => {
  let {
    name,
    description,
    excerpt,
    guild_leader,
    videoUrl,
    status,
    languages,
    tags,
    regions,
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

  if (!isValidVideoUrl(videoUrl)) {
    const error: ErrorReturn = {
      code: 400,
      message: 'videoUrl must be a valid url',
      params: ['videoUrl'],
    };
    return res.status(404).json(error);
  }

  const createData: GuildCreationData = {
    name: escape(name).trim(),
    description: escape(description).trim(),
    excerpt: trimExcerpt(escape(excerpt).trim()),
    videoUrl,
    socials: sanitiseObject(socials),
    tags: sanitiseArray(tags),
    languages: sanitiseArray(languages),
    regions: sanitiseArray(regions),
    status,
    userId,
    guild_leader: escape(guild_leader).trim(),
  };

  try {
    const { newGuild, warningMessage } = await createGuildDB(createData);
    res.status(201).json({ creator: newGuild, warningMessage });
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default createGuild;
