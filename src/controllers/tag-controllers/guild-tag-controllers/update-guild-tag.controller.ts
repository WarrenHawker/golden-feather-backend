import { NextFunction, Request, Response } from 'express';
import updateGuildTagDB from '../../../services/db-services/tag-db-services/guild-tag-db-services/update-guild-tag.service';
import { isValidCuid } from '../../../utils/functions/validate-input.function';
import { CustomError } from '../../../types/custom-error';
import responseHandler from '../../../middleware/response-handler.middleware';
import { TagUpdateData } from '../../../types/tag';

const updateGuildTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tagId } = req.params;
  const { name, description } = req.body;

  const updateData: TagUpdateData = {
    name: name ? name : undefined,
    description: description ? description : undefined,
  };

  if (!isValidCuid(tagId)) {
    return next(
      new CustomError('Invalid ID.', 400, `Invalid CUID provided: ${tagId}`)
    );
  }

  try {
    const updatedTag = await updateGuildTagDB(tagId as string, updateData);
    return responseHandler(req, res, 200, updatedTag);
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

export default updateGuildTag;
