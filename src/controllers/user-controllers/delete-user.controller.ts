import { Request, Response } from 'express';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import deleteUserDB from '../../services/db-services/user-db-services/delete-user.service';
import { ErrorReturn } from '../../types/error-return';

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidCuid(id)) {
    const error: ErrorReturn = {
      code: 400,
      message: 'invalid id',
      params: ['id'],
    };
    return res.status(error.code).json(error);
  }

  try {
    const deletedUser = await deleteUserDB(id as string);
    return res.status(200).json(deletedUser);
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default deleteUser;
