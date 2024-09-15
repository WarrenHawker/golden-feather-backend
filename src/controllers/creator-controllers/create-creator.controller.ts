import { NextFunction, Request, Response } from 'express';
import { createCreatorDB } from '../../services/db-services/creator-db-services/create-creator.service';
import responseHandler from '../../middleware/response-handler.middleware';
import { CustomError } from '../../types/custom-error';
import { CreatorCreationData } from '../../types/creator';

const createCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const createData: CreatorCreationData = {
    name: req.body.name,
    description: req.body.description,
    excerpt: req.body.excerpt,
    videoUrl: req.body.videoUrl,
    socials: req.body.socials,
    tags: req.body.tags,
    languages: req.body.languages,
    status: req.body.status,
    userId: req.body.userId,
  };

  try {
    const { newCreator, warningMessage } = await createCreatorDB(createData);
    return responseHandler(req, res, 201, { newCreator, warningMessage });
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

export default createCreator;
