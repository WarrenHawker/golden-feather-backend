import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import deleteLanguageDB from '../../services/db-services/language-db-services/delete-language.service';

const deleteLanguage = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidCuid(id)) {
    const error: ErrorReturn = {
      code: 400,
      message: 'invalid id',
      params: ['id'],
    };
    return res.status(error.code).json(error);
  }

  try {
    const deletedLanguage = await deleteLanguageDB(id as string);
    return res.status(200).json(deletedLanguage);
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default deleteLanguage;
