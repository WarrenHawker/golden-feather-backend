import { Request, Response } from 'express';
import { isValidCuid } from '../../utils/functions/validate-input.function';

import deleteCreatorDB from '../../services/db-services/creator-db-services/delete-creator.service';
import { ErrorReturn } from '../../types/error-return';

const deleteCreator = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidCuid(id)) {
    const error: ErrorReturn = {
      code: 400,
      message: 'invalid id',
      params: ['id'],
    };
    return res.status(error.code).json(error);
  }

  try {
    const deletedCreator = await deleteCreatorDB(id as string);
    return res.status(200).json(deletedCreator);
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default deleteCreator;
