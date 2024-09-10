import { ContentStatus, Prisma } from '@prisma/client';
import { unescape } from 'validator';
import prismaClient from '../../../lib/prisma/client.prisma';
import { CreatorUpdateData } from '../../../types/creator';
import { findUniqueStrings } from '../../../utils/functions/compare-arays.function';
import updateCreatorRelations from './update-creator-relations.service';

const updateCreatorDB = async (
  creatorId: string,
  options: CreatorUpdateData
) => {
  let {
    name,
    description,
    videoUrl,
    socials,
    tags,
    languages,
    status,
    userId,
  } = options;
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
    };

    if (tags) {
      const {
        itemsToConnect: tagsToConnect,
        itemsToDisconnect: tagsToDisconnect,
      } = await updateCreatorRelations('tags', creatorId, tags);

      updateData.tags = {
        disconnect: tagsToDisconnect,
        connectOrCreate: tagsToConnect,
      };
    }

    if (languages) {
      const {
        itemsToConnect: languagesToConnect,
        itemsToDisconnect: languagesToDisconnect,
      } = await updateCreatorRelations('languages', creatorId, languages);

      updateData.languages = {
        disconnect: languagesToDisconnect,
        connectOrCreate: languagesToConnect,
      };
    }

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
