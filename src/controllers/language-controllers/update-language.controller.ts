import { NextFunction, Request, Response } from 'express';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import updateLanguageDB from '../../services/db-services/language-db-services/update-language.service';
import { CustomError } from '../../types/custom-error';
import responseHandler from '../../middleware/response-handler.middleware';

const updateLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: langId } = req.params;
  const { name } = req.body;

  if (!isValidCuid(langId)) {
    return next(
      new CustomError('Invalid ID.', 400, `Invalid CUID provided: ${langId}`)
    );
  }
  try {
    const updatedLanguage = await updateLanguageDB(langId as string, name);
    return responseHandler(req, res, 200, updatedLanguage);
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

export default updateLanguage;
