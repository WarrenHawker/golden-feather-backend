import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import updateLanguageDB from '../../services/db-services/language-db-services/update-language.service';
import { escape } from 'validator';

const updateLanguage = async (req: Request, res: Response) => {
  let { id } = req.query;
  let { name } = req.body;

  if (!isValidCuid(id as string)) {
    const error: ErrorReturn = {
      code: 400,
      message: 'invalid id',
      params: ['id'],
    };
    return res.status(error.code).json(error);
  }

  if (name) name = escape(name).trim();
  try {
    const updatedLanguage = await updateLanguageDB(id as string, name);
    return res.status(200).json(updatedLanguage);
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default updateLanguage;
