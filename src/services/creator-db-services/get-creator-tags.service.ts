import { prismaClient } from '../../lib/prisma/client.prisma';

export const getCreatorTagsDB = async () => {
  try {
    const publicTags = await prismaClient.creatorTag.findMany({
      where: {
        publicCreatorTags: {
          some: {},
        },
      },
      select: {
        name: true,
      },
    });

    const adminTags = await prismaClient.creatorTag.findMany({
      where: {
        AdminCreatorTags: {
          some: {},
        },
      },
      select: {
        name: true,
      },
    });

    return { publicTags, adminTags };
  } catch (error) {
    throw error;
  }
};
