import { Request, Response } from 'express';
import { escape } from 'validator';
import {
  isContentStatus,
  isValidCuid,
  isValidVideoUrl,
} from '../../utils/functions/validate-input.function';
import { GuildUpdateData } from '../../types/guild';
import sanitiseArray from '../../utils/functions/sanitise-array.function';
import sanitiseSocials from '../../utils/functions/sanitise-socials.function';
import { ISession } from '../../types/express-session';
import updateGuildDB from '../../services/db-services/guild-db-services/update-guild.service';
import getUserContent from '../../services/db-services/user-db-services/get-user-content.service';
import { ErrorReturn } from '../../types/error-return';
import trimExcerpt from '../../utils/functions/trim-excerpt.function';

const updateGuild = async (req: Request, res: Response) => {
  let { id: guildId } = req.query;
  let {
    name,
    description,
    excerpt,
    videoUrl,
    socials,
    tags,
    languages,
    status,
    userId,
    regions,
    guildLeader: guild_leader,
  } = req.body;

  /* 
    guilds can only be updated by admins or the linked user.
    check for a valid session before continuing.
  */
  try {
    const sessionUser = (req.session as ISession).user;

    if (!sessionUser) {
      const error: ErrorReturn = {
        code: 401,
        message: 'no session found',
      };
      return res.status(error.code).json(error);
    }

    const { userGuildId } = await getUserContent(sessionUser.id);
    if (
      !userGuildId ||
      userGuildId != guildId ||
      !(sessionUser.role == 'admin' && sessionUser.status == 'active')
    ) {
      const error: ErrorReturn = {
        code: 403,
        message: 'unorthorised access',
      };
      return res.status(error.code).json(error);
    }
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }

  //assuming session is valid, continue with rest of function
  try {
    if (!isValidCuid(guildId as string)) {
      const error: ErrorReturn = {
        code: 400,
        message: 'invalid creator id',
        params: ['id'],
      };
      return res.status(error.code).json(error);
    }

    const updateData: GuildUpdateData = {};

    if (userId) {
      if (!isValidCuid(userId as string)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid user id',
          params: ['userId'],
        };
        return res.status(error.code).json(error);
      } else {
        updateData.userId = userId;
      }
    }

    if (videoUrl) {
      if (!isValidVideoUrl(videoUrl)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'videoUrl must be a valid url',
          params: ['videoUrl'],
        };
        return res.status(error.code).json(error);
      } else {
        updateData.videoUrl = videoUrl;
      }
    }

    if (status) {
      if (!isContentStatus(status)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid status',
          params: ['status'],
        };
        return res.status(error.code).json(error);
      } else {
        updateData.status = status;
      }
    }

    if (name) updateData.name = escape(name).trim();
    if (description) updateData.description = escape(description).trim();
    if (excerpt) updateData.excerpt = trimExcerpt(escape(excerpt).trim());
    if (guild_leader) updateData.guild_leader = escape(guild_leader).trim();
    if (tags && Array.isArray(tags) && tags.length > 0) {
      updateData.tags = sanitiseArray(tags);
    }
    if (languages && Array.isArray(languages) && languages.length > 0) {
      updateData.languages = sanitiseArray(languages);
    }
    if (tags && Array.isArray(tags) && tags.length > 0) {
      updateData.tags = sanitiseArray(tags);
    }
    if (regions && Array.isArray(regions) && regions.length > 0) {
      updateData.regions = sanitiseArray(regions);
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
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default updateGuild;
