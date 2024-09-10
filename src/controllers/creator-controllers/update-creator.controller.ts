import { Request, Response } from 'express';
import { escape } from 'validator';
import {
  isContentStatus,
  isValidCuid,
  isValidVideoUrl,
} from '../../utils/functions/validate-input.function';
import { CreatorUpdateData } from '../../types/creator';
import sanitiseSocials from '../../utils/functions/sanitise-socials.function';
import sanitiseArray from '../../utils/functions/sanitise-array.function';
import { ISession } from '../../types/express-session';
import getUserContent from '../../services/db-services/user-db-services/get-user-content.service';
import updateCreatorDB from '../../services/db-services/creator-db-services/update-creator.service';
import { ErrorReturn } from '../../types/error-return';
import trimExcerpt from '../../utils/functions/trim-excerpt.function';

const updateCreator = async (req: Request, res: Response) => {
  let { id: creatorId } = req.query;
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
  } = req.body;

  /* 
    creator profiles can only be updated by admins or the linked user.
    check for a valid session before continuing.
  */
  try {
    const sessionUser = (req.session as ISession).user;

    if (!sessionUser) {
      const error: ErrorReturn = {
        code: 401,
        message: 'no session found',
      };
      return res.status(401).json(error);
    }

    const { userCreatorId } = await getUserContent(sessionUser.id);
    if (
      !userCreatorId ||
      userCreatorId != creatorId ||
      !(sessionUser.role == 'admin' && sessionUser.status == 'active')
    ) {
      const error: ErrorReturn = {
        code: 403,
        message: 'unorthorised access',
      };
      return res.status(403).json(error);
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
    if (!isValidCuid(creatorId as string)) {
      const error: ErrorReturn = {
        code: 400,
        message: 'invalid creator id',
        params: ['id'],
      };
      return res.status(400).json(error);
    }

    const updateData: CreatorUpdateData = {};

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

    if (videoUrl) {
      if (!isValidVideoUrl(videoUrl)) {
        const error: ErrorReturn = {
          code: 400,
          message: 'invalid videoUrl',
          params: ['videoUrl'],
        };
        return res.status(400).json(error);
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
        return res.status(400).json(error);
      } else {
        updateData.status = status;
      }
    }

    if (name) updateData.name = escape(name).trim();
    if (description) updateData.description = escape(description).trim();
    if (excerpt) updateData.excerpt = trimExcerpt(escape(excerpt).trim());
    if (languages && Array.isArray(languages) && languages.length > 0) {
      updateData.languages = sanitiseArray(languages);
    }
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

    const { updatedCreator, warningMessage } = await updateCreatorDB(
      creatorId as string,
      updateData
    );

    return res.status(200).json({ updatedCreator, warningMessage });
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default updateCreator;
