import { Request, Response } from 'express';
import ErrorReturn from '../../types/error-return';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import deleteCreatorDB from '../../services/creator-db-services/delete-creator.service';
import createLog from '../../services/logger.service';

const deleteCreator = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidCuid(id)) {
    const error: ErrorReturn = {
      code: 40,
      message: 'invalid id',
      params: ['id'],
    };
    return res.status(400).json(error);
  }

  try {
    const deletedCreator = await deleteCreatorDB(id as string);
    return res.status(200).json(deletedCreator);
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    createLog('critical', req, res, error);
    return res.status(500).json(error);
  }
};

export default deleteCreator;
