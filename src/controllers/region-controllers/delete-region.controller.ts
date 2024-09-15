import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../types/custom-error';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import deleteRegionDB from '../../services/db-services/region-db-services/delete-region.service';
import responseHandler from '../../middleware/response-handler.middleware';

const deleteRegion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!isValidCuid(id)) {
    return next(
      new CustomError('Invalid ID.', 400, `Invalid CUID provided: ${id}`)
    );
  }
  try {
    const deletedRegion = await deleteRegionDB(id as string);
    return responseHandler(req, res, 200, deletedRegion);
  } catch (error) {
    const statusCode = (error as any).statusCode || 500;
    const detailedMessage = (error as any).message || 'Unknown error occurred';
    return next(
      new CustomError(
        'An unexpected error occurred. Please try again later.',
        statusCode,
        detailedMessage
      )
    );
  }
};

export default deleteRegion;
