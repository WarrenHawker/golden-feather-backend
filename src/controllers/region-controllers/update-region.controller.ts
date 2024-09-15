import { NextFunction, Request, Response } from 'express';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import { escape } from 'validator';
import updateRegionDB from '../../services/db-services/region-db-services/update-region.service';
import { CustomError } from '../../types/custom-error';
import responseHandler from '../../middleware/response-handler.middleware';

const updateRegion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: regionId } = req.params;
  const { name } = req.body;

  if (!isValidCuid(regionId)) {
    return next(
      new CustomError('Invalid ID.', 400, `Invalid CUID provided: ${regionId}`)
    );
  }
  try {
    const updatedRegion = await updateRegionDB(regionId as string, name);
    return responseHandler(req, res, 200, updatedRegion);
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

export default updateRegion;
