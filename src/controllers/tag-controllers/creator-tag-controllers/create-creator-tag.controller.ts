import { NextFunction, Request, Response } from 'express';
import { TagCreationData } from '../../../types/tag';
import createCreatorTagDB from '../../../services/db-services/tag-db-services/creator-tag-db-services/create-creator-tag.service';
import responseHandler from '../../../middleware/response-handler.middleware';
import { CustomError } from '../../../types/custom-error';

const createCreatorTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tag = await createCreatorTagDB(req.body);
    return responseHandler(req, res, 201, tag);
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

export default createCreatorTag;
