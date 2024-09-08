import { Request, Response } from 'express';
import { isValidCuid } from '../../utils/functions/validate-input.function';
import deleteGuildDB from '../../services/db-services/guild-db-services/delete-guild.service';

const deleteGuild = async (req: Request, res: Response) => {
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
    const deletedGuild = await deleteGuildDB(id as string);
    return res.status(200).json(deletedGuild);
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    return res.status(500).json(error);
  }
};

export default deleteGuild;
