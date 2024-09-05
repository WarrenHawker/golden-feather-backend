import { Request, Response } from 'express';
import { escape } from 'validator';
import createLog from '../../services/logger.service';
import ErrorReturn from '../../types/error-return';
import {
  isContentStatus,
  isValidCuid,
} from '../../utils/functions/validate-input.function';
import { GuildUpdateData } from '../../types/guild';
import sanitiseArray from '../../utils/functions/sanitise-array.function';
import sanitiseSocials from '../../utils/functions/sanitise-socials.function';
import updateGuildDB from '../../services/guild-db-services/update-guild.service';

const updateGuild = async (req: Request, res: Response) => {
  let { id: guildId } = req.query;
  let {
    name,
    description,
    socials,
    tags,
    language,
    status,
    userId,
    region,
    guildLeader: guild_leader,
  } = req.body;

  try {
    if (!isValidCuid(guildId as string)) {
      const error: ErrorReturn = {
        code: 400,
        message: 'invalid creator id',
        params: ['id'],
      };
      return res.status(400).json(error);
    }

    const updateData: GuildUpdateData = {};

    if (userId) {
      if (!isValidCuid(userId as string)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid user id',
          params: ['userId'],
        };
        return res.status(400).json(error);
      } else {
        updateData.userId = userId;
      }
    }

    if (status) {
      if (!isContentStatus(status)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid status',
          params: ['status'],
        };
        return res.status(400).json(error);
      } else {
        updateData.status = status;
      }
    }

    if (name) updateData.name = escape(name).trim();
    if (description) updateData.description = escape(description).trim();
    if (guild_leader) updateData.guild_leader = escape(guild_leader).trim();
    if (region) updateData.region = escape(region).trim();
    if (language) updateData.language = escape(language).trim();
    if (tags && Array.isArray(tags) && tags.length > 0) {
      updateData.tags = sanitiseArray(tags);
    }
    if (
      socials &&
      typeof socials === 'object' &&
      Object.keys(socials).length > 0
    ) {
      updateData.socials = sanitiseSocials(socials);
    }

    const { updatedGuild, warningMessage } = await updateGuildDB(
      guildId as string,
      updateData
    );
    return res.status(200).json({ updatedGuild, warningMessage });
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    createLog('critical', req, res, error);
    return res.status(500).json(error);
  }
};

export default updateGuild;
