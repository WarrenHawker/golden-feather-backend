import prismaClient from '../../../lib/prisma/client.prisma';

const getGuildTagsDB = async () => {
  try {
    const publicTags = await prismaClient.guildTag.findMany({
      where: {
        guildTags: {
          some: {
            guild: {
              status: 'public',
            },
          },
        },
      },
      select: {
        name: true,
      },
    });

    const allTags = await prismaClient.guildTag.findMany({
      where: {
        guildTags: {
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

export default getGuildTagsDB;
