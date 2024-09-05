import { ContentStatus, Prisma } from '@prisma/client';
import prismaClient from '../../lib/prisma/client.prisma';
import { CreatorUpdateData } from '../../types/creator';
import { unescape } from 'validator';
import { findUniqueStrings } from '../../utils/functions/compare-arays.function';

const updateCreatorDB = async (
  creatorId: string,
  options: CreatorUpdateData
) => {
  let { name, description, videoUrl, socials, tags, language, status, userId } =
    options;
  try {
    /*
      if userId is given, check the user exists and is not already
      linked to another creator profile. If either case happens the 
      creator profile will be created without a linked user and a 
      warning returned with the updated creator. 
    */
    let warningMessage = '';
    let user;

    if (userId) {
      user = await prismaClient.user.findUnique({
        where: { id: userId },
        include: {
          creator: true,
        },
      });

      if (!user) {
        warningMessage =
          'User not found. Creator profile will be updated without a linked user.';
      } else if (user.creator) {
        warningMessage =
          'User is already linked to another creator profile. Profile will be updated without linking the user.';
      }
    }

    let tagsToDisconnect: any[] = [];
    let tagsToConnect: any[] = [];
    if (tags) {
      tags = [...new Set(tags)];
      const currentTags = await prismaClient.creator.findUnique({
        where: { id: creatorId },
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

    const updateData: Prisma.CreatorUpdateInput = {
      name: name ? name : undefined,
      slug: name
        ? unescape(name).toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')
        : undefined,
      description: description ? description : undefined,
      videoUrl: videoUrl ? videoUrl : undefined,
      socials: socials ? socials : undefined,
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
      tags: tags
        ? { disconnect: tagsToDisconnect, connectOrCreate: tagsToConnect }
        : undefined,
    };

    const updatedCreator = await prismaClient.creator.update({
      where: { id: creatorId },
      data: updateData,
    });

    return { updatedCreator, warningMessage };
  } catch (error) {
    throw error;
  }
};

export default updateCreatorDB;
