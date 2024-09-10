import { Request, Response } from 'express';
import getLanguagesRedis from '../../services/redis-services/language-redis-services/get-languages-redis.service';
import getLanguagesDB from '../../services/db-services/language-db-services/get-languages-db.service';
import { ErrorReturn } from '../../types/error-return';

const getLanguages = async (req: Request, res: Response) => {
  try {
    const languages = await getLanguagesRedis();
    return res.status(200).json(languages);
  } catch (error) {
    try {
      const languages = await getLanguagesDB();
      if (languages.length == 0) {
        const error: ErrorReturn = {
          code: 404,
          message: 'no languages found',
        };
        return res.status(404).json(error);
      }
      return res.status(200).json(languages);
    } catch (err) {
      const error: ErrorReturn = {
        code: (err as any).statusCode || (err as any).status || 500,
        message: (err as Error).message,
        stack: (err as Error).stack,
      };
      return res.status(error.code).json(error);
    }
  }
};

export default getLanguages;
