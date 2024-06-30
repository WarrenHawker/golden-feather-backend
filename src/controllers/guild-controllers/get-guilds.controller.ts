/*
  "get guild" controller function

  retrives all guilds from the database. 
*/

//import packages
import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { createLog } from '../../services/logger.service';
import { prismaClient } from '../../lib/prisma/client.prisma';

export const getGuilds = async (req: Request, res: Response) => {
  try {
    const guilds = await prismaClient.guild.findMany();
    res.status(200).json(guilds);
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    res.status(500).json(error);
    createLog('critical', req, res, error);
    return;
  }
};
