import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';

export const getGuildBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (!slug) {
    const error: ErrorReturn = {
      code: 400,
      message: 'no slug search param found',
    };
    return res.status(400).json(error);
  }

  try {
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    return res.status(500).json(error);
  }
};
