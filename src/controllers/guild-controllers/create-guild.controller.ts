import { NextFunction, Request, Response } from 'express';
import createGuildDB from '../../services/db-services/guild-db-services/create-guild.service';
import responseHandler from '../../middleware/response-handler.middleware';
import { CustomError } from '../../types/custom-error';

const createGuild = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newGuild, warningMessage } = await createGuildDB(req.body);
    return responseHandler(req, res, 201, {
      creator: newGuild,
      warningMessage,
    });
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

export default createGuild;
