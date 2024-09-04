import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { getUserByEmailDB } from '../../services/user-db-services/get-user-by-email.service';

export const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;

  if (!email) {
    const error: ErrorReturn = {
      code: 400,
      message: 'no email search param found',
    };
    return res.status(400).json(error);
  }

  try {
    const user = await getUserByEmailDB(email as string);
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
