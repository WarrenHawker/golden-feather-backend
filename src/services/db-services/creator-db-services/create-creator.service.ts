import { unescape } from 'validator';
import prismaClient from '../../../lib/prisma/client.prisma';
import { CreatorCreationData } from '../../../types/creator';

export const createCreatorDB = async (options: CreatorCreationData) => {
  try {
    /*
      if userId is given, check the user exists and is not already
      linked to another creator profile. If either case happens the 
      creator profile will be created without a linked user and a 
      warning returned with the new creator. 
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
          'User not found. Creator profile will be created without a linked user.';
      } else if (user.creator) {
        warningMessage =
          'User is already linked to another creator profile. Profile will be created without linking the user.';
      }
    }

    const newCreatorData = {
      name: options.name,
      slug: unescape(options.name)
        .toLowerCase()
        .replace(/\//g, '-')
        .replace(/\s+/g, '-'),
      description: options.description,
      excerpt: options.excerpt,
      videoUrl: options.videoUrl,
      socials: options.socials,
      status: options.status,
      ...(options.tags.length > 0 && {
        tags: {
          create: options.tags.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: { name: tag },
                create: {
                  name: tag,
                  description: `${tag} related content.`,
                },
              },
            },
          })),
        },
      }),
      ...(options.languages.length > 0 && {
        languages: {
          create: options.languages.map((language) => ({
            language: {
              connectOrCreate: {
                where: { name: language },
                create: {
                  name: language,
                },
              },
            },
          })),
        },
      }),
      user:
        user && !user.creator ? { connect: { id: options.userId } } : undefined,
    };

    const newCreator = await prismaClient.creator.create({
      data: newCreatorData,
    });
    return { newCreator, warningMessage };
  } catch (error) {
    throw error;
  }
};
