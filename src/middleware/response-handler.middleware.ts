import { Request, Response } from 'express';
import { CustomError } from '../types/custom-error';
import logger from '../services/logger-services/logger.service';

const responseHandler = async (
  req: Request,
  res: Response,
  statusCode: number,
  data: any | null = null,
  error: CustomError | null = null
) => {
  const isError = error !== null;

  await logger(req, res, isError ? error : null);

  if (isError) {
    const errorResponse = {
      code: error!.statusCode,
      message: error!.message,
      ...(error!.params && { params: error!.params }),
      ...(error!.recaptchaScore && { recaptchaScore: error!.recaptchaScore }),
    };

    return res.status(statusCode).json(errorResponse);
  }
  return res.status(statusCode).json(data || { message: 'success' });
};

export default responseHandler;
