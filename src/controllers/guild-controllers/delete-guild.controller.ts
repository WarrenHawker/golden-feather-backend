import { NextFunction, Request, Response } from 'express';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import deleteGuildDB from '../../services/db-services/guild-db-services/delete-guild.service';
import { CustomError } from '../../types/custom-error';

const deleteGuild = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!isValidCuid(id)) {
    return next(
      new CustomError('Invalid ID.', 400, `Invalid CUID provided: ${id}`)
    );
  }

  try {
    const deletedGuild = await deleteGuildDB(id as string);
    return res.status(200).json(deletedGuild);
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

export default deleteGuild;
