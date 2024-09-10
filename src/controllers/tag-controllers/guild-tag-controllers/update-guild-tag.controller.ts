import { Request, Response } from 'express';
import { ErrorReturn } from '../../../types/error-return';
import updateGuildTagDB from '../../../services/db-services/tag-db-services/guild-tag-db-services/update-guild-tag.service';
import { TagUpdateData } from '../../../types/tag';
import { isValidCuid } from '../../../utils/functions/validate-input.function';
import { escape } from 'validator';

const updateGuildTag = async (req: Request, res: Response) => {
  let { id } = req.query;
  let { name, description } = req.body;

  if (!isValidCuid(id as string)) {
    const error: ErrorReturn = {
      code: 400,
      message: 'invalid id',
      params: ['id'],
    };
    return res.status(error.code).json(error);
  }

  const updateData: TagUpdateData = {};
  if (name) updateData.name = escape(name).trim();
  if (description) updateData.description = escape(description).trim();
  try {
    const updatedTag = await updateGuildTagDB(id as string, updateData);
    return res.status(200).json(updatedTag);
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default updateGuildTag;
