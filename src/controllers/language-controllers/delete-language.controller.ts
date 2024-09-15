import { NextFunction, Request, Response } from 'express';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import deleteLanguageDB from '../../services/db-services/language-db-services/delete-language.service';
import { CustomError } from '../../types/custom-error';
import responseHandler from '../../middleware/response-handler.middleware';

const deleteLanguage = async (
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
    const deletedLanguage = await deleteLanguageDB(id as string);
    return responseHandler(req, res, 200, deletedLanguage);
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

export default deleteLanguage;
