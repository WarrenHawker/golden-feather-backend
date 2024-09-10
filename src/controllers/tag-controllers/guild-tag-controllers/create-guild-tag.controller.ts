import { Request, Response } from 'express';
import { ErrorReturn } from '../../../types/error-return';
import { TagCreationData } from '../../../types/tag';
import createGuildTagDB from '../../../services/db-services/tag-db-services/guild-tag-db-services/create-guild-tag.service';
import { escape } from 'validator';

const createGuildTag = async (req: Request, res: Response) => {
  let { name, description } = req.body;

  try {
    const createData: TagCreationData = {
      name: escape(name).trim(),
      description: escape(description).trim(),
    };
    const tag = await createGuildTagDB(createData);
    return res.status(201).json(tag);
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default createGuildTag;
