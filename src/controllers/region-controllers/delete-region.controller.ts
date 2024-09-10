import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import deleteRegionDB from '../../services/db-services/region-db-services/delete-region.service';

const deleteRegion = async (req: Request, res: Response) => {
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
    const deletedRegion = await deleteRegionDB(id as string);
    return res.status(200).json(deletedRegion);
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default deleteRegion;
