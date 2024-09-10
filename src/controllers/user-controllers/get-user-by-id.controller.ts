import { Request, Response } from 'express';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import getUserByIdDB from '../../services/db-services/user-db-services/get-user-by-id.service';
import { ErrorReturn } from '../../types/error-return';

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidCuid(id)) {
    const error: ErrorReturn = {
      code: 40,
      message: 'invalid id',
      params: ['id'],
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
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default getUserById;
