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
  res.statusCode = statusCode;

  if (error) {
    const errorResponse = {
      code: error!.statusCode,
      message: error!.message,
      ...(error!.params && { params: error!.params }),
      ...(error!.recaptchaScore && { recaptchaScore: error!.recaptchaScore }),
    };

    res.status(statusCode).json(errorResponse);
  } else {
    res.status(statusCode).json(data || { message: 'success' });
  }

  res.on('finish', async () => {
    await logger(req, res, error);
  });
};

export default responseHandler;
