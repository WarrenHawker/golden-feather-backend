import validator from 'validator';
import { prismaClient } from '../../lib/prisma/client.prisma';
import { CreatorCreationData } from '../../types/creator';

const { unescape } = validator;

export const createCreatorDB = async (
  table: 'public' | 'admin',
  options: CreatorCreationData
) => {
  try {
    if (options.tags.length == 0) {
      throw new Error(
        'you must include at least one category in the categories array'
      );
    }

    const newCreatorData = {
      name: options.name,
      slug: unescape(options.name)
        .toLowerCase()
        .replace(/\//g, '-')
        .replace(/\s+/g, '-'),
      description: options.description,
      videoUrl: options.videoUrl,
      created_on: new Date(),
      socials: options.socials,
      language: {
        connectOrCreate: {
          where: { name: options.language },
          create: {
            name: options.language,
          },
        },
      },
      status: options.status,
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
    };

    if (table === 'public') {
      const newCreator = await prismaClient.publicCreator.create({
        data: newCreatorData,
      });
      return newCreator;
    } else if (table === 'admin') {
      const newCreator = await prismaClient.adminCreator.create({
        data: newCreatorData,
      });
      return newCreator;
    }
  } catch (error) {
    console.error(`error creating ${options.name}`);
    throw error;
  }
};
