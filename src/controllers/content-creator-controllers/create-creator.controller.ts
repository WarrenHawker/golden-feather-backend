/*
  "create content creator" controller function

  Creates a new content creator in the database. 
*/

//import packages
import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import { createLog } from '../../services/logger.service';
import validator from 'validator';
import { prismaClient } from '../../lib/prisma/client.prisma';
import { sanitiseArray } from '../../utils/functions/sanitise-array.function';
import { sanitiseObject } from '../../utils/functions/sanitise-object.function';
import { ContentStatus } from '@prisma/client';

const { isEmpty, escape, isURL } = validator;

export const createCreator = async (req: Request, res: Response) => {
  let { name, description, categories, socials, videoUrl } = req.body;

  const missingFields = [];
  if (!name) {
    missingFields.push('name');
  }
  if (!description) {
    missingFields.push('description');
  }
  if (!categories) {
    missingFields.push('categories');
  }
  if (!videoUrl) {
    missingFields.push('videoUrl');
  }
  if (missingFields.length > 0) {
    const error: ErrorReturn = {
      code: 400,
      message: 'Missing body parameters',
      params: missingFields,
    };
    res.status(400).json(error);
    createLog('error', req, res, error);
    return;
  }

  const emptyFields = [];
  if (isEmpty(name, { ignore_whitespace: true })) {
    emptyFields.push('name');
  }
  if (isEmpty(description, { ignore_whitespace: true })) {
    emptyFields.push('description');
  }
  if (isEmpty(videoUrl, { ignore_whitespace: true })) {
    emptyFields.push('videoUrl');
  }
  if (emptyFields.length > 0) {
    const error: ErrorReturn = {
      code: 400,
      message: 'Empty input fields',
      params: emptyFields,
    };
    res.status(400).json(error);
    createLog('error', req, res, error);
    return;
  }

  const creatorData = {
    name: escape(name).trim(),
    description: escape(description).trim(),
    categories: sanitiseArray(categories),
    socials: sanitiseObject(socials),
    videoUrl: isURL(videoUrl) ? videoUrl.trim() : '',
    created_on: new Date(),
    status: 'public' as ContentStatus,
  };

  try {
    const creator = await prismaClient.contentCreator.create({
      data: creatorData,
    });
    res.status(201).json(creator);
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
