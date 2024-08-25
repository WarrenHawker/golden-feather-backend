/*
  "get guild" controller function

  retrives all guilds from the database. 
*/

//import packages
import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { createLog } from '../../services/logger.service';
import { prismaClient } from '../../lib/prisma/client.prisma';

export const getGuilds = async (req: Request, res: Response) => {};
