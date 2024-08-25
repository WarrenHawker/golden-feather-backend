/*
  "update content creator" controller function

  Updates an existing content creator from the database by the id property, using data from the body params. 
*/

import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import validator from 'validator';
import { CreatorUpdateData } from '../../types/creator';
import { sanitiseArray } from '../../utils/functions/sanitise-array.function';
import { sanitiseObject } from '../../utils/functions/sanitise-object.function';
import { isContentStatus } from '../../utils/functions/validate-input.function';
import { ContentStatus } from '@prisma/client';
import { prismaClient } from '../../lib/prisma/client.prisma';

const { isEmpty, escape, isURL } = validator;

export const updateCreator = async (req: Request, res: Response) => {};
