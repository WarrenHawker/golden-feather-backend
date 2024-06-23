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

export const createGuild = async (req: Request, res: Response) => {
  let { name, region, language, bio, guildLeader } = req.body;

  const missingFields = [];
  if (!name) {
    missingFields.push('name');
  }
  if (!region) {
    missingFields.push('region');
  }
  if (!language) {
    missingFields.push('language');
  }
  if (!bio) {
    missingFields.push('bio');
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
  if (isEmpty(region, { ignore_whitespace: true })) {
    emptyFields.push('region');
  }
  if (isEmpty(language, { ignore_whitespace: true })) {
    emptyFields.push('language');
  }
  if (isEmpty(bio, { ignore_whitespace: true })) {
    emptyFields.push('bio');
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

  const guildData = {
    name: escape(name).trim(),
    region: escape(region).trim(),
    language: escape(language).trim(),
    bio: escape(bio).trim(),
    guild_leader: guildLeader || null,
    created_on: new Date(),
    status: 'public' as ContentStatus,
  };

  try {
    const guild = await prismaClient.guild.create({ data: guildData });
    res.status(201).json(guild);
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
