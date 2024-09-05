import { ContentStatus, Prisma } from '@prisma/client';
import prismaClient from '../../lib/prisma/client.prisma';
import { GuildUpdateData } from '../../types/guild';
import { findUniqueStrings } from '../../utils/functions/compare-arays.function';
import { unescape } from 'validator';

const updateGuildDB = async (guildId: string, options: GuildUpdateData) => {
  let {
    name,
    description,
    guild_leader,
    region,
    socials,
    tags,
    language,
    status,
    userId,
  } = options;

  try {
    /*
      if userId is given, check the user exists and is not already
      linked to another guild. If either case happens the 
      guild will be created without a linked user and a 
      warning returned with the updated guild. 
    */
    let warningMessage = '';
    let user;

    if (options.userId) {
      user = await prismaClient.user.findUnique({
        where: { id: options.userId },
        include: {
          creator: true,
        },
      });

      if (!user) {
        warningMessage =
          'User not found. Guild will be updated without a linked user.';
      } else if (user.creator) {
        warningMessage =
          'User is already linked to another guild profile. Guild will be updated without linking the user.';
      }
    }

    let tagsToDisconnect: any[] = [];
    let tagsToConnect: any[] = [];
    if (tags) {
      tags = [...new Set(tags)];
      const currentTags = await prismaClient.guild.findUnique({
        where: { id: guildId },
        select: {
          tags: {
            select: {
              tag: true,
            },
          },
        },
      });

      const currentTagNames =
        currentTags?.tags.map((tagRelation) => tagRelation.tag.name) ||
        undefined;
      tagsToDisconnect = findUniqueStrings(currentTagNames, tags).map((tag) => {
        return {
          tag: { name: tag },
        };
      });

      tagsToConnect = tags.map((tag) => {
        return {
          where: { name: tag },
          create: { name: tag },
        };
      });
    }
    const updateData: Prisma.GuildUpdateInput = {
      name: name ? name : undefined,
      slug: name
        ? unescape(name).toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')
        : undefined,
      description: description ? description : undefined,
      socials: socials ? socials : undefined,
      guild_leader: guild_leader ? guild_leader : undefined,
      status: status ? (status as ContentStatus) : undefined,
      user: user && !user.creator ? { connect: { id: userId } } : undefined,
      updated_on: new Date(),
      language: language
        ? {
            connectOrCreate: {
              where: { name: language },
              create: {
                name: language,
              },
            },
          }
        : undefined,
      region: region
        ? {
            connectOrCreate: {
              where: { name: region },
              create: {
                name: region,
              },
            },
          }
        : undefined,
      tags: tags
        ? { disconnect: tagsToDisconnect, connectOrCreate: tagsToConnect }
        : undefined,
    };

    const updatedGuild = await prismaClient.guild.update({
      where: { id: guildId },
      data: updateData,
    });
    return { updatedGuild, warningMessage };
  } catch (error) {
    throw error;
  }
};

export default updateGuildDB;
