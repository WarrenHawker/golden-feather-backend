import { Request, Response, NextFunction } from 'express';
import logger from '../services/logger-services/logger.service';
import { ErrorReturn } from '../types/error-return';

const logMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: ErrorReturn | null = null;

  const originalJson = res.json;
  res.json = (body: any) => {
    error = body;
    return originalJson.call(res, body);
  };

  res.on('finish', async () => {
    await logger(req, res, error);
  });

  next();
};

export default logMiddleware;
