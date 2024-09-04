import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { getUserByIdDB } from '../../services/user-db-services/get-user-by-id.service';

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    const error: ErrorReturn = {
      code: 400,
      message: 'no id search param found',
    };
    return res.status(400).json(error);
  }

  try {
    const user = await getUserByIdDB(id as string);
    if (!user) {
      const error: ErrorReturn = {
        code: 404,
        message: 'user not found',
      };
      return res.status(404).json(error);
    }
    return res.status(200).json(user);
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    return res.status(500).json(error);
  }
};
