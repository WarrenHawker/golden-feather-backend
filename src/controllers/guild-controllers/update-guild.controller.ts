/*
  "update guild" controller function

  Updates an existing guild from the database by the id property, using data from the body params. 
*/

//import packages
import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import validator from 'validator';
import { GuildUpdateData } from '../../types/guild';
import { isContentStatus } from '../../utils/functions/validate-input.function';
import { ContentStatus } from '@prisma/client';
import { prismaClient } from '../../lib/prisma/client.prisma';

const { isEmpty, escape } = validator;

export const updateGuild = async (req: Request, res: Response) => {};
