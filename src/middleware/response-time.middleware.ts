import { Request, Response, NextFunction } from 'express';

export const measureResponseTime = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start); // Get the time difference
    const responseTimeMs = diff[0] * 1e3 + diff[1] * 1e-6; // Convert to milliseconds
    res.locals.responseTimeMs = responseTimeMs; // Attach the response time to res.locals
  });

  next();
};
