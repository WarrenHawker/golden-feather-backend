import { NextFunction, Request, Response } from 'express';
import { TagCreationData } from '../../../types/tag';
import createGuildTagDB from '../../../services/db-services/tag-db-services/guild-tag-db-services/create-guild-tag.service';
import { escape } from 'validator';
import responseHandler from '../../../middleware/response-handler.middleware';
import { CustomError } from '../../../types/custom-error';

const createGuildTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const createData: TagCreationData = {
    name: req.body.name,
    description: req.body.description,
  };

  try {
    const tag = await createGuildTagDB(createData);
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

export default createGuildTag;
