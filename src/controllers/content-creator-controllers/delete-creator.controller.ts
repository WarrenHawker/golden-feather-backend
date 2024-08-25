/*
  "delete content creator" controller function

  Deletes an existing content creator from the database by the id property. 
*/

import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import validator from 'validator';
import { prismaClient } from '../../lib/prisma/client.prisma';
import { createLog } from '../../services/logger.service';

const { escape, isEmpty } = validator;

export const deleteCreator = async (req: Request, res: Response) => {};
