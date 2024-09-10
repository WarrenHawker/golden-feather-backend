import prismaClient from '../../../../lib/prisma/client.prisma';

const getCreatorTagsDB = async () => {
  try {
    const publicTags = await prismaClient.creatorTag.findMany({
      where: {
        creatorTags: {
          some: {
            creator: {
              status: 'public',
            },
          },
        },
      },
      select: {
        name: true,
      },
    });

    const allTags = await prismaClient.creatorTag.findMany({
      where: {
        creatorTags: {
          some: {},
        },
      },
      select: {
        name: true,
      },
    });

    return { publicTags, allTags };
  } catch (error) {
    throw error;
  }
};

export default getCreatorTagsDB;
