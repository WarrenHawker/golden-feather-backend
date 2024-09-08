import compression from 'compression';
import { Request, Response } from 'express';

export const shouldCompress = (req: Request, res: Response) => {
  if (req.headers['x-no-compression']) {
    return false;
  }

  return compression.filter(req, res);
};

export const compressionMiddleware = compression({
  filter: shouldCompress,
  threshold: 0, // Compress all responses
  level: 6, // Set the compression level (optional, default is 4 for Brotli)
});
