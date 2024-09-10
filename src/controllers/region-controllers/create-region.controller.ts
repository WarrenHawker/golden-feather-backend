import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { escape } from 'validator';
import createRegionDB from '../../services/db-services/region-db-services/create-region.service';

const createRegion = async (req: Request, res: Response) => {
  let { name } = req.body;

  try {
    name = escape(name).trim();
    const region = await createRegionDB(name);
    return res.status(201).json(region);
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default createRegion;
