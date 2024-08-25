/*
  "delete guild" controller function

  Deletes an existing guild from the database by the id property. 
*/

//import packages
import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import validator from 'validator';
import { prismaClient } from '../../lib/prisma/client.prisma';
import { createLog } from '../../services/logger.service';

const { escape, isEmpty } = validator;

export const deleteGuild = async (req: Request, res: Response) => {};
