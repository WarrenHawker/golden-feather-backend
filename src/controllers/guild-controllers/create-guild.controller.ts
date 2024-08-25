/*
  "create guild" controller function

  Creates a new guild in the database. 
*/

//import packages
import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { createLog } from '../../services/logger.service';
import validator from 'validator';
import { prismaClient } from '../../lib/prisma/client.prisma';
import { ContentStatus } from '@prisma/client';

const { isEmpty, escape } = validator;

export const createGuild = async (req: Request, res: Response) => {};
