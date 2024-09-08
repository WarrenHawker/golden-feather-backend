import { Request, Response } from 'express';
import ErrorReturn from '../../types/error-return';
import createLog from '../../services/logger.service';
import getLanguagesRedis from '../../services/redis-services/language-redis-services/get-languages-redis.service';
import getLanguagesDB from '../../services/db-services/language-db-services/get-languages-db.service';

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
        code: 500,
        message: (err as Error).message,
      };
      createLog('critical', req, res, error);
      return res.status(500).json(error);
    }
  }
};

export default getLanguages;
