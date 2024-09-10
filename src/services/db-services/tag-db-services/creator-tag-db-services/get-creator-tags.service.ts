import prismaClient from '../../../../lib/prisma/client.prisma';

const getCreatorTagsDB = async () => {
  try {
    const publicData = await prismaClient.creatorTag.findMany({
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

    const publicTags = Array.from(new Set(publicData.map((tag) => tag.name)));

    const allTags = await prismaClient.creatorTag.findMany();
    return { publicTags, allTags };
  } catch (error) {
    throw error;
  }
};

export default getCreatorTagsDB;
