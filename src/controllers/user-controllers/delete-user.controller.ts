import { Request, Response } from 'express';
import ErrorReturn from '../../types/error-return';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import deleteUserDB from '../../services/db-services/user-db-services/delete-user.service';

const deleteUser = async (req: Request, res: Response) => {
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
    const deletedUser = await deleteUserDB(id as string);
    return res.status(200).json(deletedUser);
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    return res.status(500).json(error);
  }
};

export default deleteUser;
