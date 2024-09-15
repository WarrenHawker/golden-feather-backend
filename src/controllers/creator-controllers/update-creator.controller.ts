import { NextFunction, Request, Response } from 'express';
import { ISession } from '../../types/express-session';
import getUserContent from '../../services/db-services/user-db-services/get-user-content.service';
import updateCreatorDB from '../../services/db-services/creator-db-services/update-creator.service';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import { CustomError } from '../../types/custom-error';
import responseHandler from '../../middleware/response-handler.middleware';
import { CreatorUpdateData } from '../../types/creator';

const updateCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: creatorId } = req.params;

  if (!isValidCuid(creatorId)) {
    return next(
      new CustomError('Invalid ID.', 400, `Invalid CUID provided: ${creatorId}`)
    );
  }

  /* 
    creator profiles can only be updated by admins or the linked user.
    check for a valid session before continuing.
  */
  try {
    const sessionUser = (req.session as ISession).user;

    const { userCreatorId } = await getUserContent(sessionUser.id);
    if (
      !userCreatorId ||
      userCreatorId != creatorId ||
      !(sessionUser.role == 'admin' && sessionUser.status == 'active')
    ) {
      return next(
        new CustomError(
          'You do not have permission to access this resource.',
          403,
          `User id ${userCreatorId}, role ${sessionUser.role} and status ${sessionUser.status} cannot access that resource.`
        )
      );
    }
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

  //assuming session is valid, continue with rest of function

  const {
    name,
    description,
    excerpt,
    videoUrl,
    socials,
    tags,
    languages,
    status,
    userId,
  } = req.body;

  const updateData: CreatorUpdateData = {
    name: name ? (name as string) : undefined,
    description: description ? (description as string) : undefined,
    excerpt: excerpt ? (excerpt as string) : undefined,
    videoUrl: videoUrl ? (videoUrl as string) : undefined,
    socials: socials ? socials : undefined,
    tags: tags ? tags : undefined,
    languages: languages ? languages : undefined,
    status: status ? status : undefined,
    userId: userId ? userId : undefined,
  };

  try {
    const { updatedCreator, warningMessage } = await updateCreatorDB(
      creatorId as string,
      updateData
    );

    return responseHandler(req, res, 200, { updatedCreator, warningMessage });
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

export default updateCreator;
