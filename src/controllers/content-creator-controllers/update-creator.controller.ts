/*
  "update content creator" controller function

  Updates an existing content creator from the database by the id property, using data from the body params. 
*/

//import packages
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

export const updateCreator = async (req: Request, res: Response) => {
  let { name, description, categories, socials, videoUrl, status } = req.body;
  const creatorId = req.params.id;

  const updateData: CreatorUpdateData = {
    updated_on: new Date(),
  };

  if (name) {
    name = escape(name as string).trim();
    if (!isEmpty(name, { ignore_whitespace: true })) {
      updateData.name = name;
    }
  }

  if (description) {
    description = escape(description as string).trim();
    if (!isEmpty(description, { ignore_whitespace: true })) {
      updateData.description = description;
    }
  }

  if (categories) {
    updateData.categories = sanitiseArray(categories);
  }

  if (socials) {
    updateData.socials = sanitiseObject(socials);
  }

  if (videoUrl) {
    if (!isURL(videoUrl)) {
      const error: ErrorReturn = {
        code: 400,
        message: 'Invalid "videoUrl" body parameter.',
        params: ['videoUrl'],
      };
      res.status(400).json(error);
      return;
    } else {
      updateData.videoUrl = videoUrl.trim();
    }
  }

  if (status) {
    if (!isContentStatus(status)) {
      const error: ErrorReturn = {
        code: 400,
        message: 'Invalid "status" body parameter.',
        params: ['status'],
      };
      res.status(400).json(error);
      return;
    } else {
      updateData.status = status.trim() as ContentStatus;
    }
  }

  try {
    const creator = await prismaClient.contentCreator.update({
      where: { id: creatorId },
      data: updateData,
    });

    res.status(200).json(creator);
    return;
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    res.status(500).json(error);
    return;
  }
};
