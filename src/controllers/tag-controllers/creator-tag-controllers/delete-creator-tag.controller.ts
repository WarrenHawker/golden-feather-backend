import { NextFunction, Request, Response } from 'express';
import { isValidCuid } from '../../../utils/functions/validate-input.function';
import deleteCreatorTagDB from '../../../services/db-services/tag-db-services/creator-tag-db-services/delete-creator-tag.service';
import responseHandler from '../../../middleware/response-handler.middleware';
import { CustomError } from '../../../types/custom-error';

const deleteCreatorTag = async (
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
    const deletedCreatorTag = await deleteCreatorTagDB(id as string);
    return responseHandler(req, res, 200, deletedCreatorTag);
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

export default deleteCreatorTag;
