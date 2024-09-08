import { Request, Response } from 'express';
import { escape } from 'validator';
import { CreatorCreationData } from '../../types/creator';
import {
  isContentStatus,
  isValidCuid,
  isValidVideoUrl,
} from '../../utils/functions/validate-input.function';
import createLog from '../../services/logger.service';
import ErrorReturn from '../../types/error-return';
import sanitiseArray from '../../utils/functions/sanitise-array.function';
import sanitiseSocials from '../../utils/functions/sanitise-socials.function';
import { createCreatorDB } from '../../services/db-services/creator-db-services/create-creator.service';

const createCreator = async (req: Request, res: Response) => {
  let { name, description, videoUrl, socials, tags, language, status, userId } =
    req.body;

  if (!isValidVideoUrl(videoUrl)) {
    const error: ErrorReturn = {
      code: 400,
      message: 'videoUrl must be a valid url',
      params: ['videoUrl'],
    };
    return res.status(404).json(error);
  }

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

  const createData: CreatorCreationData = {
    name: escape(name).trim(),
    description: escape(description).trim(),
    videoUrl,
    socials: sanitiseSocials(socials),
    tags: sanitiseArray(tags),
    language: escape(language).trim(),
    status,
    userId,
  };

  try {
    const { newCreator, warningMessage } = await createCreatorDB(createData);
    res.status(201).json({ creator: newCreator, warningMessage });
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    createLog('critical', req, res, error);
    return res.status(500).json(error);
  }
};

export default createCreator;
