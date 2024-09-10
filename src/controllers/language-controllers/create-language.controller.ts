import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { escape } from 'validator';
import createLanguageDB from '../../services/db-services/language-db-services/create-language.service';

const createLanguage = async (req: Request, res: Response) => {
  let { name } = req.body;

  try {
    name = escape(name).trim();
    const language = await createLanguageDB(name);
    return res.status(201).json(language);
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default createLanguage;
