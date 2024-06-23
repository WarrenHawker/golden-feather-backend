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

export const updateGuild = async (req: Request, res: Response) => {
  let { name, region, language, bio, guildLeader, status } = req.body;
  const guildId = req.params.id;

  const updateData: GuildUpdateData = {
    updated_on: new Date(),
  };

  if (name) {
    name = escape(name as string).trim();
    if (!isEmpty(name, { ignore_whitespace: true })) {
      updateData.name = name;
    }
  }

  if (region) {
    region = escape(region as string).trim();
    if (!isEmpty(region, { ignore_whitespace: true })) {
      updateData.region = region;
    }
  }

  if (language) {
    region = escape(language as string).trim();
    if (!isEmpty(language, { ignore_whitespace: true })) {
      updateData.language = language;
    }
  }

  if (bio) {
    bio = escape(bio as string).trim();
    if (!isEmpty(bio, { ignore_whitespace: true })) {
      updateData.bio = bio;
    }
  }

  if (guildLeader) {
    guildLeader = escape(guildLeader as string).trim();
    if (!isEmpty(guildLeader, { ignore_whitespace: true })) {
      updateData.guild_leader = guildLeader;
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
    const guild = await prismaClient.guild.update({
      where: { id: guildId },
      data: updateData,
    });

    res.status(200).json(guild);
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
