import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { getCreatorBySlugDB } from '../../services/creator-db-services/get-creator-by-slug.service';

export const getCreatorBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (!slug) {
    const error: ErrorReturn = {
      code: 400,
      message: 'no slug search param found',
    };
    return res.status(400).json(error);
  }

  try {
    const creator = await getCreatorBySlugDB(slug as string);
    return res.status(200).json(creator);
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    return res.status(500).json(error);
  }
};
