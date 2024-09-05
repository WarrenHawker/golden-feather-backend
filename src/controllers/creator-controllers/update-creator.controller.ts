import { Request, Response } from 'express';
import { escape } from 'validator';
import {
  isContentStatus,
  isValidCuid,
  isValidVideoUrl,
} from '../../utils/functions/validate-input.function';
import createLog from '../../services/logger.service';
import ErrorReturn from '../../types/error-return';
import { CreatorUpdateData } from '../../types/creator';
import sanitiseSocials from '../../utils/functions/sanitise-socials.function';
import sanitiseArray from '../../utils/functions/sanitise-array.function';
import updateCreatorDB from '../../services/creator-db-services/update-creator.service';

const updateCreator = async (req: Request, res: Response) => {
  let { id: creatorId } = req.query;
  let { name, description, videoUrl, socials, tags, language, status, userId } =
    req.body;

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

    const { updatedCreator, warningMessage } = await updateCreatorDB(
      creatorId as string,
      updateData
    );

    return res.status(200).json({ updatedCreator, warningMessage });
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    createLog('critical', req, res, error);
    return res.status(500).json(error);
  }
};

export default updateCreator;
