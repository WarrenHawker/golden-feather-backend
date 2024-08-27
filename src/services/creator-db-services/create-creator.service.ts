import { prismaClient } from '../../lib/prisma/client.prisma';
import { CreatorCreationData } from '../../types/creator';

export const createCreator = async (
  table: 'public' | 'admin',
  options: CreatorCreationData
) => {
  try {
    if (options.categories.length == 0) {
      throw new Error(
        'you must include at least one category in the categories array'
      );
    }

    const newCreatorData = {
      name: options.name,
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
      categories: {
        create: options.categories.map((category) => ({
          category: {
            connectOrCreate: {
              where: { name: category },
              create: {
                name: category,
                description: `${category} related content.`,
              },
            },
          },
        })),
      },
    };

    if (table === 'public') {
      const newCreator = await prismaClient.publicContentCreator.create({
        data: newCreatorData,
      });
      return newCreator;
    } else if (table === 'admin') {
      const newCreator = await prismaClient.adminContentCreator.create({
        data: newCreatorData,
      });
      return newCreator;
    }
  } catch (error) {
    console.error(`error creating ${options.name}`);
    throw error;
  }
};
