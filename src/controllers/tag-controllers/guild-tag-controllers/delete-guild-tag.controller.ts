import { Request, Response } from 'express';
import { ErrorReturn } from '../../../types/error-return';
import { isValidCuid } from '../../../utils/functions/validate-input.function';
import deleteGuildTagDB from '../../../services/db-services/tag-db-services/guild-tag-db-services/delete-guild-tag.service';

const deleteGuildTag = async (req: Request, res: Response) => {
  let { id } = req.query;

  if (!isValidCuid(id as string)) {
    const error: ErrorReturn = {
      code: 400,
      message: 'invalid id',
      params: ['id'],
    };
    return res.status(error.code).json(error);
  }
  try {
    const deletedGuildTag = await deleteGuildTagDB(id as string);
    return res.status(200).json(deletedGuildTag);
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default deleteGuildTag;
