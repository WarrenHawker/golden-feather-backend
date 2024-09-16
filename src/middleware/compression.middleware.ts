import compression from 'compression';
import { Request, Response } from 'express';
import zlib from 'zlib';

export const shouldCompress = (req: Request, res: Response) => {
  if (req.headers['x-no-compression']) {
    return false;
  }

  const contentType = res.getHeader('Content-Type') as string;
  if (contentType && /image|audio|video|pdf/.test(contentType)) {
    return false;
  }

  return compression.filter(req, res);
};

export const compressionMiddleware = compression({
  filter: shouldCompress,
  threshold: 1024,
  level: 6,
  brotli: {
    enabled: true,
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 6, // Brotli compression quality (0-11)
    },
  },
});
