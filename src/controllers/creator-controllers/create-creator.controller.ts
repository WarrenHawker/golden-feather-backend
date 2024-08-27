/*
  "create content creator" controller function

  Creates a new content creator in the database. 
*/

import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { createLog } from '../../services/logger.service';
import validator from 'validator';
import { prismaClient } from '../../lib/prisma/client.prisma';
import { sanitiseArray } from '../../utils/functions/sanitise-array.function';
import { sanitiseObject } from '../../utils/functions/sanitise-object.function';
import { ContentStatus } from '@prisma/client';

const { isEmpty, escape, isURL } = validator;

export const createCreator = async (req: Request, res: Response) => {};
