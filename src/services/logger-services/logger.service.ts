import { ErrorReturn } from '../../types/error-return';
import { Request, Response } from 'express';
import logCritical from './log-critical.service';
import logError from './log-error.service';
import logInfo from './log-info.service';

const logger = async (
  req: Request,
  res: Response,
  error: ErrorReturn | null = null
) => {
  const statusCode = res.statusCode;
  const method = req.method;

  //successful GET requests (level: info)
  if (method == 'GET' && statusCode < 300) {
    await logInfo({ req, res });
    return;
  }

  //404 errors from GET requests (level: info)
  if (method == 'GET' && statusCode == 404) {
    await logInfo({ req, res, error });
  }

  //successful POST, PATCH or DELETE requests (level: info)
  if (method != 'GET' && statusCode < 300) {
    await logInfo({ req, res });
  }

  //4xx errors from POST, PATCH or DELETE requests (level: error)
  if (method != 'GET' && statusCode >= 300 && statusCode < 500) {
    await logError({ req, res, error });
  }

  //5xx errors from any request (level: critical)
  if (statusCode >= 500) {
    await logCritical({ req, res, error });
  }
};

export default logger;
